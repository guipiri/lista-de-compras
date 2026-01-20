"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSocket } from "@/hooks/useSocket";
import ShoppingItemComponent from "./ShoppingItem";
import AddItemForm from "./AddItemForm";

interface SharedListPageProps {
  shareToken: string;
  password?: string;
}

interface ShoppingItem {
  id: string;
  title: string;
  completed: boolean;
  listId: string;
  createdAt: string;
  updatedAt: string;
}

interface SharedList {
  id: string;
  name: string;
  shareToken: string;
  isPrivate: boolean;
  items: ShoppingItem[];
}

export default function SharedListPage({
  shareToken,
  password,
}: SharedListPageProps) {
  const [list, setList] = useState<SharedList | null>(null);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState(password || "");
  const [error, setError] = useState<string | null>(null);
  const socket = useSocket(list?.id);

  const fetchSharedList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `/api/lists/${shareToken}`;
      if (passwordInput) {
        url += `?pass=${encodeURIComponent(passwordInput)}`;
      }

      const response = await fetch(url);

      if (response.status === 401) {
        const data = await response.json();
        if (data.requiresPassword) {
          setRequiresPassword(true);
          setLoading(false);
          return;
        }
        setError(data.error || "Senha incorreta");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch shared list");
      }

      const data = await response.json();
      setList(data);
      setItems(data.items || []);
      setRequiresPassword(false);
    } catch (error) {
      console.error("Error fetching shared list:", error);
      setError("Erro ao carregar a lista compartilhada");
    } finally {
      setLoading(false);
    }
  }, [shareToken, passwordInput]);

  useEffect(() => {
    fetchSharedList();
  }, [shareToken, password, fetchSharedList]);

  useEffect(() => {
    if (!socket) return;

    socket.on("item:created", (newItem: ShoppingItem) => {
      // Apenas adicionar se for da lista atual
      if (newItem.listId === list?.id) {
        setItems((prev) => [newItem, ...prev]);
      }
    });

    socket.on("item:updated", (updatedItem: ShoppingItem) => {
      // Apenas atualizar se for da lista atual
      if (updatedItem.listId === list?.id) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          )
        );
      }
    });

    socket.on("item:deleted", (deletedItemId: string) => {
      setItems((prev) => prev.filter((item) => item.id !== deletedItemId));
    });

    return () => {
      socket.off("item:created");
      socket.off("item:updated");
      socket.off("item:deleted");
    };
  }, [socket, list?.id]);

  async function handleAddItem(title: string) {
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, listId: list?.id }),
      });

      if (!response.ok) throw new Error("Failed to add item");
      const newItem = await response.json();

      if (socket) {
        socket.emit("item:create", newItem);
      }

      setItems((prev) => [newItem, ...prev]);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }

  async function handleToggleItem(id: string, completed: boolean) {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });

      if (!response.ok) throw new Error("Failed to update item");
      const updatedItem = await response.json();

      if (socket) {
        socket.emit("item:update", updatedItem);
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? updatedItem : item
        )
      );
    } catch (error) {
      console.error("Error updating item:", error);
    }
  }

  async function handleDeleteItem(id: string) {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete item");

      if (socket) {
        socket.emit("item:delete", id);
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSharedList();
  };

  const completedCount = items.filter((item) => item.completed).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700">Carregando lista compartilhada...</p>
        </div>
      </div>
    );
  }

  if (requiresPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-center">🔒 Lista Protegida</h1>
          <p className="text-gray-700 mb-6 text-center">
            Esta lista requer uma senha para acesso.
          </p>
          <form onSubmit={handleSubmitPassword} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Digite a senha"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-medium"
            >
              Acessar Lista
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">❌ Erro</h1>
          <p className="text-gray-700 mb-6">
            {error || "Lista não encontrada"}
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Voltar para Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                🛒 {list.name}
              </h1>
              {list.isPrivate && (
                <p className="text-xs text-amber-600 mt-1">🔒 Lista Privada</p>
              )}
            </div>
            <div className="text-xs sm:text-sm text-gray-700 whitespace-nowrap font-medium">
              {completedCount} de {items.length} concluído
            </div>
          </div>

          <AddItemForm onAddItem={handleAddItem} />

          <div className="mt-8">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-700">
                  Nenhum item na lista.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <ShoppingItemComponent
                    key={item.id}
                    item={item}
                    onToggle={handleToggleItem}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              ✨ Sincronização em tempo real ativada
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import ShoppingItemComponent from "./ShoppingItem";
import AddItemForm from "./AddItemForm";

export interface ShoppingList {
  id: string;
  name: string;
  shareToken: string;
  isPrivate: boolean;
  items: ShoppingItem[];
}

export interface ShoppingItem {
  id: string;
  title: string;
  completed: boolean;
  listId: string;
  createdAt: string;
  updatedAt: string;
}

export default function ShoppingListComponent() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateList, setShowCreateList] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState<string>("");
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const socket = useSocket(list?.id);

  useEffect(() => {
    fetchList();
  }, []);

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

  async function fetchList() {
    try {
      setLoading(true);
      const response = await fetch("/api/lists");
      if (!response.ok) throw new Error("Failed to fetch lists");
      const lists = await response.json();
      
      // Usar a primeira lista ou criar uma nova
      if (lists.length > 0) {
        const currentList = lists[0];
        setList(currentList);
        setItems(currentList.items || []);
      } else {
        // Criar lista padrão
        const createResponse = await fetch("/api/lists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Minha Lista" }),
        });
        if (createResponse.ok) {
          const newList = await createResponse.json();
          setList(newList);
          setItems([]);
        }
      }
    } catch (error) {
      console.error("Error fetching list:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePrivateList(
    name: string,
    password: string
  ) {
    try {
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          isPrivate: true,
          password,
        }),
      });

      if (!response.ok) throw new Error("Failed to create list");
      const newList = await response.json();
      setList(newList);
      setItems([]);
      setShowCreateList(false);
    } catch (error) {
      console.error("Error creating private list:", error);
      alert("Erro ao criar lista privada");
    }
  }

  function generateShareLink() {
    if (!list) return;

    const baseUrl = window.location.origin;
    let link = `${baseUrl}/shared/${list.shareToken}`;

    if (list.isPrivate) {
      // Armazenar a senha na sessão do localStorage para facilitar
      link += `?pass=${encodeURIComponent(list.shareToken)}`;
    }

    setShareLink(link);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(shareLink);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  }

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

  const completedCount = items.filter((item) => item.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                🛒 {list?.name || "Lista de Compras"}
              </h1>
              {list?.isPrivate && (
                <p className="text-xs text-amber-600 mt-1">🔒 Lista Privada</p>
              )}
            </div>
            <div className="flex gap-2 items-start">
              <div className="text-xs sm:text-sm text-gray-700 whitespace-nowrap font-medium">
                {completedCount} de {items.length} concluído
              </div>
              <button
                onClick={() => {
                  generateShareLink();
                  setShowShareModal(true);
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded text-xs sm:text-sm hover:bg-blue-600 transition whitespace-nowrap"
              >
                Compartilhar
              </button>
            </div>
          </div>

          <AddItemForm onAddItem={handleAddItem} />

          <div className="mt-8">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-700">Carregando itens...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-700">
                  Nenhum item na lista. Adicione um novo item!
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

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 space-y-3">
            <p className="text-xs text-gray-500 text-center">
              ✨ Sincronização em tempo real ativada
            </p>
            <div className="text-center">
              <button
                onClick={() => setShowCreateList(true)}
                className="text-xs text-blue-600 hover:underline"
              >
                + Criar nova lista privada
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Compartilhamento */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Compartilhar Lista</h2>
            <div className="bg-gray-100 p-4 rounded mb-4 break-all text-sm">
              {shareLink}
            </div>
            {list?.isPrivate && (
              <p className="text-sm text-amber-600 mb-4">
                🔒 Esta é uma lista privada. A senha será validada ao acessar o link.
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {copiedToClipboard ? "✓ Copiado!" : "Copiar Link"}
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criar Lista Privada */}
      {showCreateList && (
        <CreatePrivateListModal
          onClose={() => setShowCreateList(false)}
          onCreate={handleCreatePrivateList}
        />
      )}
    </div>
  );
}

function CreatePrivateListModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, password: string) => void;
}) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("Nome da lista é obrigatório");
      return;
    }

    if (!password.trim()) {
      alert("Senha é obrigatória");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não correspondem");
      return;
    }

    if (password.length < 4) {
      alert("A senha deve ter no mínimo 4 caracteres");
      return;
    }

    onCreate(name, password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">🔒 Criar Lista Privada</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome da Lista</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Supermercado"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite uma senha"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirmar Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme a senha"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Criar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


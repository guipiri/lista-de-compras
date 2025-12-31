"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import ShoppingItemComponent from "./ShoppingItem";
import AddItemForm from "./AddItemForm";

export interface ShoppingItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ShoppingListComponent() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("item:created", (newItem: ShoppingItem) => {
      setItems((prev) => [newItem, ...prev]);
    });

    socket.on("item:updated", (updatedItem: ShoppingItem) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        )
      );
    });

    socket.on("item:deleted", (deletedItemId: string) => {
      setItems((prev) => prev.filter((item) => item.id !== deletedItemId));
    });

    return () => {
      socket.off("item:created");
      socket.off("item:updated");
      socket.off("item:deleted");
    };
  }, [socket]);

  async function fetchItems() {
    try {
      setLoading(true);
      const response = await fetch("/api/items");
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddItem(title: string) {
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) throw new Error("Failed to add item");
      const newItem = await response.json();
      
      // Emit event to socket
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
      
      // Emit event to socket
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
      
      // Emit event to socket
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              🛒 Lista de Compras
            </h1>
            <div className="text-sm text-gray-600">
              {completedCount} de {items.length} concluído
            </div>
          </div>

          <AddItemForm onAddItem={handleAddItem} />

          <div className="mt-8">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando itens...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
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

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              ✨ Sincronização em tempo real ativada
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

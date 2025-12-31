"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface AddItemFormProps {
  onAddItem: (title: string) => void;
}

export default function AddItemForm({ onAddItem }: AddItemFormProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      await onAddItem(input);
      setInput("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite um novo item..."
        className="flex-grow px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-500 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !input.trim()}
        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base whitespace-nowrap"
      >
        <Plus size={18} className="sm:w-5 sm:h-5" />
        <span>Adicionar</span>
      </button>
    </form>
  );
}

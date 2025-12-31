"use client";

import { ShoppingItem } from "./ShoppingList";
import { Trash2, Check } from "lucide-react";

interface ShoppingItemComponentProps {
  item: ShoppingItem;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export default function ShoppingItemComponent({
  item,
  onToggle,
  onDelete,
}: ShoppingItemComponentProps) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
        item.completed
          ? "bg-gray-100 border-gray-300"
          : "bg-white border-gray-200 hover:border-blue-300"
      }`}
    >
      <button
        onClick={() => onToggle(item.id, item.completed)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          item.completed
            ? "bg-green-500 border-green-500"
            : "border-gray-300 hover:border-green-500"
        }`}
      >
        {item.completed && <Check size={16} className="text-white" />}
      </button>

      <span
        className={`flex-grow text-lg transition-all ${
          item.completed
            ? "line-through text-gray-500"
            : "text-gray-800"
        }`}
      >
        {item.title}
      </span>

      <button
        onClick={() => onDelete(item.id)}
        className="flex-shrink-0 p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
        title="Deletar item"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}

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
      className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg border-2 transition-all ${
        item.completed
          ? "bg-gray-100 border-gray-300"
          : "bg-white border-gray-200 hover:border-blue-300"
      }`}
    >
      <button
        onClick={() => onToggle(item.id, item.completed)}
        className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors touch-manipulation ${
          item.completed
            ? "bg-green-500 border-green-500"
            : "border-gray-300 hover:border-green-500"
        }`}
      >
        {item.completed && <Check size={14} className="text-white sm:w-4 sm:h-4" />}
      </button>

      <span
        className={`flex-grow text-sm sm:text-base md:text-lg transition-all break-words ${
          item.completed
            ? "line-through text-gray-500"
            : "text-gray-800"
        }`}
      >
        {item.title}
      </span>

      <button
        onClick={() => onDelete(item.id)}
        className="flex-shrink-0 p-1.5 sm:p-2 text-red-500 hover:bg-red-100 active:bg-red-200 rounded-lg transition-colors touch-manipulation"
        title="Deletar item"
      >
        <Trash2 size={18} className="sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}

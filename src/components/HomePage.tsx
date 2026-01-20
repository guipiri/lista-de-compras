"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [showCreateList, setShowCreateList] = useState(false);
  const [showCreatePrivateList, setShowCreatePrivateList] = useState(false);
  const router = useRouter();

  async function handleCreateList(name: string, isPrivate: boolean, password?: string) {
    try {
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          isPrivate,
          password: isPrivate ? password : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create list");
      const newList = await response.json();
      
      // Redirecionar para a lista criada
      const url = `/shared/${newList.shareToken}${isPrivate ? `?pass=${encodeURIComponent(password || '')}` : ''}`;
      router.push(url);
    } catch (error) {
      console.error("Error creating list:", error);
      alert("Erro ao criar lista");
    }
  }

  async function handleCreatePublicList(name: string) {
    await handleCreateList(name, false);
    setShowCreateList(false);
  }

  async function handleCreatePrivateListSubmit(name: string, password: string) {
    await handleCreateList(name, true, password);
    setShowCreatePrivateList(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 sm:text-4xl">
              🛒 Lista de Compras
            </h1>
            <p className="text-gray-600">
              Crie e compartilhe suas listas de compras
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <button
                onClick={() => setShowCreateList(true)}
                className="w-full px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium text-lg shadow-md hover:shadow-lg cursor-pointer"
              >
                + Criar Lista Pública
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                Pode ser acessada por qualquer pessoa com o link
              </div>
            </div>

            <div className="relative group">
              <button
                onClick={() => setShowCreatePrivateList(true)}
                className="w-full px-6 py-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-medium text-lg shadow-md hover:shadow-lg cursor-pointer"
              >
                🔒 Criar Lista Privada
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                Exige senha para acesso
              </div>
            </div>
          </div>

          <div className="mt-8"></div>
        </div>
      </div>

      {/* Modal Criar Lista Pública */}
      {showCreateList && (
        <CreatePublicListModal
          onClose={() => setShowCreateList(false)}
          onCreate={handleCreatePublicList}
        />
      )}

      {/* Modal Criar Lista Privada */}
      {showCreatePrivateList && (
        <CreatePrivateListModal
          onClose={() => setShowCreatePrivateList(false)}
          onCreate={handleCreatePrivateListSubmit}
        />
      )}
    </div>
  );
}

function CreatePublicListModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("Nome da lista é obrigatório");
      return;
    }

    onCreate(name);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-700">📝 Criar Lista Pública</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome da lista"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
            >
              Criar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
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
        <h2 className="text-xl font-bold mb-4 text-gray-700">🔒 Criar Lista Privada</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome da lista"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite uma senha"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
            />
          </div>
          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme a senha"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition cursor-pointer"
            >
              Criar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

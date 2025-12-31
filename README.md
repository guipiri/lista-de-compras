# 🛒 Lista de Compras em Tempo Real

Uma aplicação moderna de lista de compras com sincronização em tempo real usando Next.js, SQLite (desenvolvimento) e Socket.io.

## ✨ Características

- ✅ **Sincronização em Tempo Real**: Todos os clientes conectados veem as mudanças instantaneamente
- 🎨 **Interface Responsiva**: Design moderno com Tailwind CSS
- ⚡ **Performance**: Construído com Next.js 16 e TypeScript
- 🔄 **CRUD Completo**: Criar, ler, atualizar e deletar itens
- 💾 **Banco de Dados Persistente**: SQLite em desenvolvimento, pronto para PostgreSQL
- 🚀 **Fácil de Usar**: Interface intuitiva e amigável

## 🛠️ Tech Stack

- **Frontend**: React 19 + Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (desenvolvimento) / PostgreSQL (produção)
- **ORM**: Prisma
- **Real-time**: Socket.io + Socket.io Client
- **Icons**: Lucide React
- **Language**: TypeScript

## 📋 Pré-requisitos

- Node.js 18+ e npm
- (Opcional) PostgreSQL para produção

## 🚀 Instalação e Execução

### 1. Instale as Dependências

```bash
npm install
```

### 2. Configure o Banco de Dados

O banco de dados SQLite já está configurado. Se desejar usar PostgreSQL, atualize `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/lista_compras"
```

### 3. Execute o Servidor em Modo Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📖 Como Usar

1. **Adicionar Item**: Digite o nome do item e clique em "Adicionar"
2. **Marcar Concluído**: Clique no círculo para marcar como concluído
3. **Deletar**: Clique no ícone de lixo para remover

## 🔧 Estrutura

```
src/
├── app/
│   ├── api/
│   │   └── items/         # API Routes
│   └── page.tsx           # Página principal
├── components/
│   ├── ShoppingList.tsx   # Componente principal
│   ├── ShoppingItem.tsx   # Item individual
│   └── AddItemForm.tsx    # Formulário
├── hooks/
│   └── useSocket.ts       # Hook Socket.io
├── lib/
│   ├── prisma.ts          # Cliente Prisma
│   └── socketServer.ts    # Gerenciador Socket.io
└── instrumentation.ts     # Inicialização
```

## 📡 API Endpoints

- `GET /api/items` - Listar itens
- `POST /api/items` - Criar item
- `PATCH /api/items/[id]` - Atualizar item
- `DELETE /api/items/[id]` - Deletar item

## 🔄 Sincronização em Tempo Real

Usa Socket.io com fallback para polling. Eventos:

- `item:created` - Novo item criado
- `item:updated` - Item atualizado
- `item:deleted` - Item deletado

## 📦 Scripts

```bash
npm run dev      # Modo desenvolvimento
npm run build    # Build para produção
npm start        # Servidor produção
npm run lint     # Linter
```

---

**Desenvolvido com ❤️ usando Next.js e Socket.io**

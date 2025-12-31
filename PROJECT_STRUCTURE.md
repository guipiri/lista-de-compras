# Estrutura do Projeto - Lista de Compras

```
lista-de-compras/
├── .github/                          # GitHub workflows e configs
├── .next/                            # Next.js build output (gitignored)
├── node_modules/                     # Dependências (gitignored)
├── prisma/                           # Prisma ORM
│   ├── migrations/                   # Database migrations
│   ├── schema.prisma                 # Database schema
│   ├── dev.db                        # SQLite database (development)
│   └── seed.ts                       # Database seeding (opcional)
├── public/                           # Assets estáticos
│   ├── favicon.ico
│   ├── next.svg
│   └── vercel.svg
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/
│   │   │   └── items/
│   │   │       ├── route.ts          # GET /api/items, POST /api/items
│   │   │       └── [id]/
│   │   │           └── route.ts      # PATCH /api/items/[id], DELETE /api/items/[id]
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page (/)
│   ├── components/                   # React components
│   │   ├── ShoppingList.tsx          # Component principal com lógica
│   │   ├── ShoppingItem.tsx          # Item individual da lista
│   │   ├── AddItemForm.tsx           # Formulário para adicionar item
│   │   └── ...                       # Outros componentes
│   ├── hooks/                        # Custom React hooks
│   │   └── useSocket.ts              # Hook para conexão Socket.io
│   ├── lib/                          # Utilitários e bibliotecas
│   │   ├── prisma.ts                 # Cliente Prisma singleton
│   │   ├── socketServer.ts           # Socket.io server initialization
│   │   └── ...                       # Outras utilitários
│   ├── styles/                       # Estilos globais
│   │   └── globals.css               # CSS global
│   ├── types/                        # TypeScript types (opcional)
│   │   └── index.ts                  # Type definitions
│   └── instrumentation.ts            # Inicialização de recursos (Prisma, Socket.io)
├── .env                              # Variáveis de ambiente (gitignored)
├── .env.example                      # Exemplo de variáveis de ambiente
├── .eslintrc.json                    # ESLint configuration
├── .gitignore                        # Git ignore rules
├── docker-compose.yml                # Docker compose para PostgreSQL
├── eslint.config.mjs                 # ESLint config (moderno)
├── next.config.ts                    # Next.js configuration
├── next-env.d.ts                     # TypeScript definitions para Next.js
├── package.json                      # Dependências e scripts
├── package-lock.json                 # Lock file (gitignored em algumas configs)
├── postcss.config.mjs                # PostCSS configuration (Tailwind)
├── prisma.config.ts                  # Prisma configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── README.md                         # Documentação principal do projeto
├── QUICKSTART.md                     # Guia rápido de início
├── DEVELOPMENT.md                    # Guia de desenvolvimento
├── DEPLOYMENT.md                     # Guia de deployment
├── TESTING.md                        # Guia de testes
└── PROJECT_STRUCTURE.txt             # Este arquivo
```

## Descrição dos Diretórios

### `/src/app`
- **Next.js App Router** - Define as rotas do aplicativo
- **`api/`** - Rotas API (endpoints REST)
- **`page.tsx`** - Página inicial

### `/src/components`
- Componentes React reutilizáveis
- **ShoppingList.tsx** - Component pai com estado e lógica
- **ShoppingItem.tsx** - Item individual renderizado em loop
- **AddItemForm.tsx** - Formulário para novo item

### `/src/hooks`
- **useSocket.ts** - Hook personalizado para Socket.io
- Gerencia conexão e desconexão automática

### `/src/lib`
- **prisma.ts** - Singleton do cliente Prisma
- **socketServer.ts** - Inicialização e handlers de Socket.io
- Funções utilitárias compartilhadas

### `/prisma`
- **schema.prisma** - Definição do modelo de dados
- **migrations/** - Histórico de alterações no banco
- **dev.db** - Banco SQLite (desenvolvimento)

### `/public`
- Arquivos estáticos servidos diretamente
- Imagens, ícones, etc.

## Arquivos de Configuração Principais

| Arquivo | Propósito |
|---------|-----------|
| `next.config.ts` | Configuração do Next.js |
| `tsconfig.json` | Configuração do TypeScript |
| `tailwind.config.ts` | Temas e customizações Tailwind |
| `.env` | Variáveis de ambiente (desenvolvimento) |
| `prisma.config.ts` | Configuração do Prisma |
| `docker-compose.yml` | Containers para desenvolvimento |

## Fluxo de Dados

```
Usuário (Browser)
    ↓
[React Component]
    ↓
[HTTP Request] → [Next.js API Route]
    ↓
[Prisma] → [SQLite/PostgreSQL]
    ↓
[Socket.io Broadcast]
    ↓
[Todos os Clientes Conectados]
    ↓
[Atualização em Tempo Real]
```

## Dependências Principais

- **Next.js 16** - React Framework
- **React 19** - UI Library
- **TypeScript** - Tipagem
- **Prisma 7** - ORM
- **Socket.io** - Real-time communication
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento (hot reload)
npm run build    # Build para produção
npm start        # Inicia servidor produção
npm run lint     # ESLint check
```

## Segurança Importante

Arquivos que **NÃO** devem ser commitados (em `.gitignore`):
- `.env` - Variáveis sensíveis
- `node_modules/` - Dependências
- `.next/` - Build output
- `prisma/dev.db` - Banco de desenvolvimento
- `*.log` - Arquivos de log

## Próximas Melhorias

- [ ] Adicionar testes automáticos
- [ ] Implementar autenticação JWT
- [ ] Criar múltiplas listas por usuário
- [ ] Adicionar categorias de itens
- [ ] Implementar busca e filtros
- [ ] Criar app mobile com React Native

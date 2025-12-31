# Guia de Desenvolvimento - Lista de Compras

## Configuração Rápida

### 1. Instalar Dependências
```bash
npm install
```

### 2. Setup do Banco de Dados

#### Opção A: SQLite (Padrão - Recomendado para Desenvolvimento)
Já está pré-configurado, nenhuma ação necessária.

#### Opção B: PostgreSQL

1. Certifique-se que PostgreSQL está instalado ou use Docker:
```bash
docker-compose up -d
```

2. Atualize `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lista_compras?schema=public"
```

3. Execute as migrações:
```bash
npx prisma db push
```

### 3. Iniciar Desenvolvimento
```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── items/
│   │   │       ├── route.ts          (GET/POST itens)
│   │   │       └── [id]/
│   │   │           └── route.ts      (PATCH/DELETE item)
│   │   ├── layout.tsx
│   │   └── page.tsx                  (Home)
│   ├── components/
│   │   ├── ShoppingList.tsx          (Componente principal)
│   │   ├── ShoppingItem.tsx          (Item individual)
│   │   └── AddItemForm.tsx           (Formulário de adição)
│   ├── hooks/
│   │   └── useSocket.ts              (Hook para Socket.io)
│   ├── lib/
│   │   ├── prisma.ts                 (Cliente Prisma)
│   │   └── socketServer.ts           (Socket.io server)
│   └── instrumentation.ts            (Inicialização)
├── prisma/
│   ├── schema.prisma                 (Schema do banco)
│   ├── migrations/                   (Histórico de migrações)
│   └── dev.db                        (Banco SQLite)
└── public/
```

## Desenvolvimento

### Adicionar Nova Feature

1. **Criar modelo no Prisma** (`prisma/schema.prisma`)
2. **Executar migração**: `npx prisma migrate dev --name feature_name`
3. **Criar rotas API** em `src/app/api/`
4. **Criar componentes** em `src/components/`
5. **Adicionar Socket.io events** em `src/lib/socketServer.ts`

### Prisma Studio
Para visualizar dados em tempo real:
```bash
npx prisma studio
```

### Lint
```bash
npm run lint
```

## Compilação

### Build para Produção
```bash
npm run build
```

### Testar Build Localmente
```bash
npm run build
npm start
```

## Troubleshooting

### Erro: "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### Banco de Dados Corrompido
```bash
rm prisma/dev.db
npx prisma db push
```

### Socket.io não conectando
- Verificar se o servidor está rodando: `npm run dev`
- Verificar console browser para mensagens de erro
- Tentar limpar cache: `Ctrl+Shift+Delete` (DevTools)

## Variáveis de Ambiente

Veja `.env.example` para todas as opções disponíveis.

### Desenvolvimento
```env
DATABASE_URL="file:./prisma/dev.db"
NODE_ENV="development"
```

### Produção
```env
DATABASE_URL="postgresql://..."
NODE_ENV="production"
```

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor desenvolvimento |
| `npm run build` | Compila para produção |
| `npm start` | Inicia servidor produção |
| `npm run lint` | Executa ESLint |

## Dicas de Desenvolvimento

1. **Hot Reload**: Componentes atualizam automaticamente ao salvar
2. **API Routes**: Mudar arquivo em `src/app/api/` recarrega automaticamente
3. **TypeScript**: Use tipos para evitar erros
4. **React DevTools**: Instale extensão do browser para debug

## Próximos Passos

- [ ] Adicionar autenticação
- [ ] Criar múltiplas listas
- [ ] Implementar categorias
- [ ] Adicionar filtros
- [ ] Criar app móvel

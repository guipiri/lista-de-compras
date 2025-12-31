# Quick Start - Lista de Compras

Bem-vindo ao seu app de Lista de Compras com sincronização em tempo real!

## 🚀 Iniciar em 30 segundos

```bash
# 1. Instalar dependências (apenas na primeira vez)
npm install

# 2. Iniciar desenvolvimento
npm run dev

# 3. Abrir no navegador
# http://localhost:3000
```

É isso! A aplicação está rodando com sincronização em tempo real habilitada.

## 🧪 Testar Sincronização em Tempo Real

1. Abra [http://localhost:3000](http://localhost:3000) em uma aba do navegador
2. Abra a mesma URL em outra aba (ou em outro dispositivo)
3. Adicione um item em uma aba
4. **Veja a mudança aparecer instantaneamente na outra aba!**

## 📁 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `src/components/ShoppingList.tsx` | Componente principal da lista |
| `src/app/api/items/route.ts` | API para CRUD de itens |
| `src/lib/socketServer.ts` | Socket.io server |
| `prisma/schema.prisma` | Schema do banco de dados |
| `.env` | Configurações de ambiente |

## 🛠️ Tarefas Comuns

### Adicionar um novo campo no item
```prisma
// prisma/schema.prisma
model ShoppingItem {
  id        String   @id @default(cuid())
  title     String
  quantity  Int      @default(1)  // ← Novo campo
  completed Boolean  @default(false)
  // ...
}
```

Depois execute:
```bash
npx prisma migrate dev --name add_quantity
```

### Modificar a interface
Editar: `src/components/ShoppingList.tsx`

### Cambiar banco de dados
Atualizar `DATABASE_URL` em `.env`:
```env
# Para PostgreSQL:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lista_compras?schema=public"
```

## 📚 Documentação Completa

- **[README.md](README.md)** - Overview do projeto
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Guia de desenvolvimento
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guia de deployment
- **[TESTING.md](TESTING.md)** - Guia de testes

## 💡 Dicas

- **Hot Reload**: Salve um arquivo e as mudanças aparecem automaticamente
- **Prisma Studio**: Execute `npx prisma studio` para ver/editar dados
- **Lint**: Execute `npm run lint` para verificar o código
- **Build**: Execute `npm run build` para testar produção localmente

## ⚠️ Troubleshooting

### "Port 3000 already in use"
```bash
# Use outra porta
npm run dev -- -p 3001
```

### Socket.io não conecta
- Verificar console do navegador (F12)
- Tentar limpar cache (Ctrl+Shift+Delete)
- Reiniciar servidor

### Banco de dados corrompido
```bash
rm prisma/dev.db
npx prisma db push
```

## 🎯 Próximos Passos

1. ✅ **Funcionamento básico** - Pronto!
2. 🔄 **Sincronização em tempo real** - Pronto!
3. 💾 **Banco de dados persistente** - Pronto!
4. 🔐 **Adicionar autenticação** - TODO
5. 📱 **Criar app móvel** - TODO

## 🆘 Precisa de ajuda?

- Verifique os logs do servidor (terminal onde rodou `npm run dev`)
- Abra DevTools (F12) e verifique a aba Console
- Leia [DEVELOPMENT.md](DEVELOPMENT.md) para mais detalhes

---

**Divirta-se desenvolvendo! 🎉**

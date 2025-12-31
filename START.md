# 🎉 Bem-vindo à Lista de Compras com Sincronização em Tempo Real!

Seu app está pronto para usar! Siga os passos abaixo para começar.

## ⚡ Início Rápido (2 minutos)

```bash
# 1. Instalar dependências (primeira vez apenas)
npm install

# 2. Iniciar o servidor
npm run dev

# 3. Abrir no navegador
# http://localhost:3000
```

## �� Testar Sincronização em Tempo Real

Para ver a sincronização funcionando:

1. Abra [http://localhost:3000](http://localhost:3000) em **2 abas diferentes**
2. Na aba 1, adicione: "Leite"
3. Veja a mudança acontecer **instantaneamente** na aba 2 ✨

## 📚 Documentação

- **[QUICKSTART.md](QUICKSTART.md)** - Guia rápido (leia isto primeiro!)
- **[README.md](README.md)** - Documentação completa
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Como desenvolver novas features
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Como colocar em produção
- **[TESTING.md](TESTING.md)** - Como testar
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Estrutura do projeto

## ✨ Funcionalidades Implementadas

✅ Adicionar itens à lista
✅ Marcar itens como concluído
✅ Deletar itens
✅ **Sincronização em tempo real** (Socket.io)
✅ Banco de dados persistente (SQLite/PostgreSQL)
✅ Interface moderna (Tailwind CSS)
✅ Totalmente em TypeScript
✅ Ready for production (build otimizado)

## 🛠️ Tech Stack

- **Frontend**: React 19 + Next.js 16
- **Backend**: Next.js API Routes
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Real-time**: Socket.io
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 🚀 Comandos Úteis

```bash
npm run dev        # Inicia em modo desenvolvimento
npm run build      # Compila para produção
npm start          # Roda a build de produção
npm run lint       # Verifica código (ESLint)
```

## 📱 Usar em Outro Dispositivo

Para acessar do seu celular/tablet na mesma rede:

1. Descubra seu IP local: `ipconfig getifaddr en0` (Mac) ou `hostname -I` (Linux)
2. Acesse: `http://SEU_IP:3000`
3. Veja a sincronização funcionando em tempo real!

## 🐛 Algo deu errado?

### Port 3000 já está em uso
```bash
npm run dev -- -p 3001
```

### Socket.io não conecta
- Abra DevTools (F12)
- Vá para a aba Console
- Procure por mensagens de erro
- Reinicie o servidor

### Banco de dados corrompido
```bash
rm prisma/dev.db
npx prisma db push
npm run dev
```

## 📞 Estrutura de Pastas

```
src/
├── app/
│   ├── api/items/          ← API para CRUD
│   └── page.tsx            ← Página principal
├── components/             ← Componentes React
├── hooks/                  ← Custom hooks
└── lib/                    ← Utilitários (Prisma, Socket.io)
```

## 🎯 Próximos Passos

1. **Entender o código**: Leia `src/components/ShoppingList.tsx`
2. **Adicionar feature**: Veja [DEVELOPMENT.md](DEVELOPMENT.md)
3. **Fazer deploy**: Veja [DEPLOYMENT.md](DEPLOYMENT.md)
4. **Testar**: Veja [TESTING.md](TESTING.md)

## 🌟 Dicas Pro

- **Hot Reload**: Salve um arquivo e as mudanças aparecem automaticamente
- **Prisma Studio**: Execute `npx prisma studio` para visualizar/editar dados
- **TypeScript**: Use tipos para evitar bugs
- **DevTools**: F12 para debugar Socket.io

## ✅ Checklist de Primeiro Uso

- [ ] Executei `npm install`
- [ ] Executei `npm run dev`
- [ ] Acessei http://localhost:3000
- [ ] Adicionei um item
- [ ] Testei em outra aba (sincronização)
- [ ] Li [QUICKSTART.md](QUICKSTART.md)

---

**Pronto para começar? Execute `npm run dev` e aproveite! 🚀**

**Dúvidas?** Consulte a documentação em [README.md](README.md)

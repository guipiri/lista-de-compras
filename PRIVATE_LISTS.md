# 🔒 Feature de Listas Privadas com Compartilhamento Seguro

Esta documentação descreve a nova feature implementada para criar listas de compras privadas com acesso protegido por senha.

## 📋 O que foi implementado

### 1. **Modelo de Dados Atualizado**
- Nova tabela `ShoppingList` para gerenciar múltiplas listas
- Campos adicionados:
  - `name`: Nome da lista
  - `isPrivate`: Flag indicando se a lista é privada
  - `password`: Senha para listas privadas (criptografia opcional)
  - `shareToken`: Token único para compartilhamento

### 2. **Endpoints da API**

#### GET `/api/lists`
- Lista todas as listas do usuário
- Retorna lista com items relacionados

#### POST `/api/lists`
- Cria uma nova lista
- Parâmetros:
  ```json
  {
    "name": "Nome da Lista",
    "isPrivate": true,
    "password": "senha123"
  }
  ```

#### GET `/api/lists/:shareToken`
- Acessa uma lista compartilhada
- Query param: `?pass=senha123` (obrigatório se privada)
- Validação automática de senha

#### GET `/api/items`
- Busca items de uma lista
- Parâmetros:
  - `listId`: ID da lista (opcional)
  - `shareToken`: Token de compartilhamento (opcional)
  - `pass`: Senha (obrigatório se lista privada)

#### POST `/api/items`
- Cria novo item
- Agora requer `listId` do corpo

## 🎯 Como Usar

### Criar uma Lista Privada

1. Clique em "+ Criar nova lista privada" na página inicial
2. Defina um nome para a lista
3. Defina uma senha (mínimo 4 caracteres)
4. Confirme a senha
5. Clique em "Criar"

### Compartilhar uma Lista Privada

1. Acesse a lista que deseja compartilhar
2. Clique no botão "Compartilhar"
3. Será gerado um link do tipo:
   ```
   http://localhost:3000/shared/cmklxucga0001ebu8xalnevai?pass=sua_senha
   ```
4. Copie o link clicando em "Copiar Link"
5. Compartilhe o link com outras pessoas

### Acessar uma Lista Compartilhada

**Se a lista NÃO é privada:**
- Basta acessar o link compartilhado
- Acesso imediato

**Se a lista É privada:**
- Acesse o link
- Será solicitado a senha
- Digite a senha e clique em "Acessar Lista"
- A senha pode estar na URL como `?pass=` ou você pode digitá-la no formulário

## 🔐 Segurança

### Considerações de Segurança Atuais

- A senha é armazenada em texto plano no banco de dados (para fins de demonstração)
- A senha é transmitida via URL (considerar HTTPS em produção)
- Token de compartilhamento é gerado com `cuid()` (aleatório)

### Recomendações para Produção

1. **Hash de Senha**: Usar bcrypt ou similar
   ```typescript
   import bcrypt from 'bcrypt';
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **HTTPS Obrigatório**: Usar apenas em conexões seguras

3. **Rate Limiting**: Adicionar limite de tentativas de senha

4. **Logs de Acesso**: Registrar acessos a listas privadas

5. **Token com Expiração**: Considerar tokens que expiram após um tempo

## 📝 Estrutura de Banco de Dados

```prisma
model ShoppingList {
  id              String   @id @default(cuid())
  name            String   @default("Minha Lista")
  isPrivate       Boolean  @default(false)
  password        String?
  shareToken      String   @unique @default(cuid())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  items           ShoppingItem[]
}

model ShoppingItem {
  id        String   @id @default(cuid())
  title     String
  completed Boolean  @default(false)
  listId    String
  list      ShoppingList @relation(fields: [listId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🔄 Fluxo de Sincronização em Tempo Real

O Socket.IO continua funcionando para sincronização em tempo real:

```
Client 1 (cria item)
    ↓
Socket Server
    ↓
Client 2 (recebe atualização em tempo real)
```

### Eventos Suportados
- `item:created` - Novo item criado
- `item:updated` - Item atualizado
- `item:deleted` - Item deletado

## 📱 Páginas Públicas

### `/` (Página Principal)
- Gerenciar listas do usuário
- Criar novas listas
- Compartilhar listas
- Adicionar/editar/deletar items

### `/shared/:shareToken`
- Acessar lista compartilhada
- Validação de senha se necessário
- Sincronização em tempo real

## 🚀 Funcionalidades Futuras Sugeridas

1. Autenticação de usuários
2. Criptografia de senhas (bcrypt)
3. Expiração de links compartilhados
4. Permissões de leitura/escrita
5. Histórico de alterações
6. Arquivamento de listas
7. Categorias de items
8. Quantidade de items
9. Notificações em tempo real
10. Mobile app com React Native

## 🐛 Troubleshooting

### A lista não carrega
- Verifique se o banco de dados está rodando
- Verifique a conexão em `.env` com `DATABASE_URL`

### Senha não funciona
- Certifique-se de digitar exatamente como foi criada (sensível a maiúsculas/minúsculas)
- Verifique se a URL está correta

### Socket.IO não sincroniza
- Verifique se o servidor está rodando
- Abra as Developer Tools (F12) e verifique a aba Network/WebSocket

## 📞 Suporte

Para mais informações sobre Socket.IO, consulte: https://socket.io/docs/
Para mais informações sobre Next.js: https://nextjs.org/docs/
Para mais informações sobre Prisma: https://www.prisma.io/docs/

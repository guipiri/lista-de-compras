# 🔄 Sincronização de Socket por Lista - Teste

## Como Testar a Sincronização por Lista

### Cenário de Teste:
1. Abra 2 abas do navegador na mesma lista
2. Abra 2 abas do navegador em listas diferentes
3. Verifique que apenas as abas na mesma lista recebem as atualizações

### Passo a Passo:

#### 1. Criar Duas Listas
- Acesse http://localhost:3000
- Clique em "+ Criar nova lista privada"
- Crie "Lista A" com senha "123456"
- Clique em "+ Criar nova lista privada"  
- Crie "Lista B" com senha "123456"

#### 2. Teste 1: Mesma Lista em Duas Abas
1. Abra Lista A em uma aba (aba 1)
2. Abra Lista A em outra aba (aba 2)
3. Na aba 1, adicione um item: "Maçã"
4. Na aba 2, você verá "Maçã" aparecer em tempo real
5. Na aba 2, adicione um item: "Banana"
6. Na aba 1, você verá "Banana" aparecer em tempo real

**Resultado Esperado**: ✅ Sincronização perfeita entre as abas da mesma lista

#### 3. Teste 2: Listas Diferentes
1. Abra Lista A em uma aba (aba 3)
2. Abra Lista B em outra aba (aba 4)
3. Na aba 3, adicione um item: "Pão"
4. Na aba 4, você NÃO verá "Pão" aparecer (apenas em aba 3)
5. Na aba 4, adicione um item: "Leite"
6. Na aba 3, você NÃO verá "Leite" aparecer (apenas em aba 4)

**Resultado Esperado**: ✅ Isolamento de sincronização - cada lista sincroniza apenas com ela mesma

#### 4. Teste 3: Mesma Lista em 3+ Abas
1. Abra Lista A em 3 abas diferentes
2. Em qualquer uma delas, edite/delete/crie items
3. Todos os itens aparecem/mudam em TODAS as 3 abas simultaneamente

**Resultado Esperado**: ✅ Múltiplas conexões da mesma lista sincronizadas

## Logs do Socket para Debug

Observe no console do servidor (npm run dev) os logs:

```
📍 Client abc123 joining list room: list_uuid_here
📝 Item created event: { id: '...', title: '...', listId: 'list_uuid_here', ... }
```

Isso confirma que:
1. O cliente entrou na room correta
2. O evento foi emitido com o `listId` correto
3. O broadcast foi apenas para aquela room

## Como Funciona Internamente

### Antes (Sem Rooms):
```
Client A (Lista 1) -> Socket -> Todos os clientes
Client B (Lista 2) -> Socket -> RECEBE ATUALIZAÇÃO DA LISTA 1 ❌
```

### Depois (Com Rooms):
```
Client A (Lista 1) -> join('list:lista1_id')
Client B (Lista 2) -> join('list:lista2_id')

Client A cria item -> to('list:lista1_id') -> Apenas clientes em lista1
Client B cria item -> to('list:lista2_id') -> Apenas clientes em lista2
```

## Arquivos Modificados

### 1. `src/lib/socketServer.ts`
- Adicionado evento `join:list` e `leave:list`
- Modificados emits para usar `io.to('list:listId')` em vez de `socket.broadcast.emit`
- Funções de broadcast agora recebem `listId`

### 2. `src/hooks/useSocket.ts`
- Agora aceita parâmetro `listId`
- Emite `join:list` automaticamente ao conectar
- Emite `leave:list` ao desconectar

### 3. `src/components/ShoppingList.tsx`
- Passa `list?.id` ao hook useSocket

### 4. `src/components/SharedListPage.tsx`
- Passa `list?.id` ao hook useSocket

## Socket.IO Rooms - Documentação

Rooms permitem que você envie mensagens para um subconjunto de clientes:

```typescript
// Entrar em uma room
socket.join('list:abc123');

// Enviar para todos em uma room
io.to('list:abc123').emit('event', data);

// Sair de uma room
socket.leave('list:abc123');
```

Isso é muito eficiente pois o servidor não envia para clientes que não precisam!

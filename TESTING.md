# Testing Guide - Lista de Compras

## Manual Testing Checklist

### 1. Funcionalidades Básicas

- [ ] **Adicionar Item**
  - Digite um nome e clique em "Adicionar"
  - Item deve aparecer no topo da lista
  - Campo deve ser limpo após adicionar

- [ ] **Marcar Concluído**
  - Clique no círculo ao lado do item
  - Item deve ficar com strikethrough
  - Círculo deve ficar verde

- [ ] **Desmarcar Concluído**
  - Clique novamente no círculo
  - Item volta ao normal
  - Círculo volta ao cinza

- [ ] **Deletar Item**
  - Clique no ícone de lixo
  - Item deve desaparecer da lista
  - Contador deve atualizar

### 2. Sincronização em Tempo Real

- [ ] **Múltiplas Abas**
  - Abra a mesma URL em 2 abas
  - Adicione item em uma aba
  - Item deve aparecer automaticamente na outra aba

- [ ] **Outras Operações**
  - Marque como concluído em uma aba
  - Status deve atualizar em tempo real na outra
  - Mesmo para deleção

### 3. Interface

- [ ] **Responsividade**
  - Teste em desktop, tablet e mobile
  - Layout deve se adaptar
  - Inputs devem ser acessíveis

- [ ] **Contador**
  - Contar itens concluídos vs. total
  - Deve atualizar em tempo real

### 4. Validação

- [ ] **Campo Vazio**
  - Tente adicionar sem digitar nada
  - Botão deve estar desabilitado

- [ ] **Espaços em Branco**
  - Digite apenas espaços
  - Sistema deve rejeitar

## Testes Automáticos (Futuros)

Configurar Jest e Testing Library:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### Exemplo de Teste de Componente

```typescript
import { render, screen } from '@testing-library/react';
import AddItemForm from '@/components/AddItemForm';

describe('AddItemForm', () => {
  it('should render form', () => {
    render(<AddItemForm onAddItem={() => {}} />);
    expect(screen.getByPlaceholderText(/Digite um novo item/i)).toBeInTheDocument();
  });
});
```

## Testes de API

```bash
npm install --save-dev jest-mock-extended
```

### Exemplo de Teste de Rota

```typescript
import { POST } from '@/app/api/items/route';

describe('/api/items', () => {
  it('should create item', async () => {
    const request = new Request('http://localhost/api/items', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test Item' }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data.title).toBe('Test Item');
  });
});
```

## Testes de Socket.io

```bash
npm install --save-dev socket.io-mock-ts
```

### Exemplo de Teste

```typescript
import { initializeSocket } from '@/lib/socketServer';
import { Server as HTTPServer } from 'http';

describe('Socket.io', () => {
  it('should broadcast item:created', (done) => {
    const httpServer = {} as HTTPServer;
    const io = initializeSocket(httpServer);
    
    io.on('connection', (socket) => {
      io.emit('item:created', { id: '1', title: 'Test' });
      
      socket.on('item:created', (item) => {
        expect(item.title).toBe('Test');
        done();
      });
    });
  });
});
```

## Performance Testing

### Lighthouse
```bash
npm install -g lighthouse
lighthouse http://localhost:3000
```

### K6 Load Test
```bash
# Instalar K6: https://k6.io/docs/getting-started/installation/
k6 run load-test.js
```

Exemplo `load-test.js`:
```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const url = 'http://localhost:3000/api/items';
  const payload = JSON.stringify({ title: 'Item ' + __VU });
  
  const response = http.post(url, payload);
  check(response, {
    'status is 201': (r) => r.status === 201,
  });
}
```

## Browser Testing

### Playwright (Recomendado)
```bash
npm install --save-dev @playwright/test
```

Exemplo:
```typescript
import { test, expect } from '@playwright/test';

test('should add item', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  await page.fill('input[placeholder*="Digite"]', 'Test Item');
  await page.click('button:has-text("Adicionar")');
  
  await expect(page.locator('text=Test Item')).toBeVisible();
});
```

### Cypress
```bash
npm install --save-dev cypress
npx cypress open
```

## Checklist Final

- [ ] Testes manuais passaram
- [ ] Build compila sem erros
- [ ] Performance aceitável (Lighthouse score > 80)
- [ ] Sem console errors
- [ ] Socket.io funciona em múltiplas conexões
- [ ] Responsive em todos os breakpoints

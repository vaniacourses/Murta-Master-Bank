# API de Cartões

API responsável pelo gerenciamento de cartões bancários, permitindo solicitação, consulta, atualização de status, exclusão e visualização de transações recentes.

## Autenticação

Todas as rotas exigem autenticação via JWT.

### Header

```http
Authorization: Bearer {token}
```

---

# Endpoints

## Solicitar Cartão

Cria uma solicitação de cartão vinculada a uma conta.

### Endpoint

```http
POST /cartoes/solicitar
```

### Body

```json
{
  "contaId": 1,
  "tipo": "CREDITO",
  "senhaTransacional": "1234"
}
```

### Campos

| Campo | Tipo | Descrição |
|---------|---------|---------|
| contaId | number | ID da conta que receberá o cartão |
| tipo | string | Tipo do cartão (`CREDITO` ou `DEBITO`) |
| senhaTransacional | string | Senha utilizada para validação de transações |

### Exemplo de Resposta

```json
{
  "id": 1,
  "numero": "**** **** **** 1234",
  "tipo": "CREDITO",
  "status": "PENDENTE",
  "contaId": 1,
  "createdAt": "2026-06-14T12:00:00Z"
}
```

---

## Listar Cartões de uma Conta

Retorna todos os cartões associados a uma conta.

### Endpoint

```http
GET /cartoes/conta/{contaId}
```

### Exemplo

```http
GET /cartoes/conta/1
```

### Exemplo de Resposta

```json
[
  {
    "id": 1,
    "tipo": "CREDITO",
    "status": "ATIVO"
  },
  {
    "id": 2,
    "tipo": "DEBITO",
    "status": "BLOQUEADO"
  }
]
```

---

## Buscar Cartão por ID

Retorna os detalhes de um cartão específico.

### Endpoint

```http
GET /cartoes/{id}
```

### Exemplo

```http
GET /cartoes/1
```

### Exemplo de Resposta

```json
{
  "id": 1,
  "numero": "**** **** **** 1234",
  "tipo": "CREDITO",
  "status": "ATIVO",
  "contaId": 1,
  "createdAt": "2026-06-14T12:00:00Z"
}
```

---

## Atualizar Status do Cartão

Altera o status de um cartão.

### Endpoint

```http
PUT /cartoes/{id}/status
```

### Exemplo

```http
PUT /cartoes/1/status
```

### Body

```json
{
  "status": "BLOQUEADO"
}
```

### Status disponíveis

- `ATIVO`
- `BLOQUEADO`
- `CANCELADO`
- `PENDENTE`

### Exemplo de Resposta

```json
{
  "id": 1,
  "status": "BLOQUEADO",
  "updatedAt": "2026-06-14T14:30:00Z"
}
```

---

## Excluir Cartão

Remove um cartão do sistema.

### Endpoint

```http
DELETE /cartoes/{id}
```

### Exemplo

```http
DELETE /cartoes/1
```

### Exemplo de Resposta

```json
{
  "message": "Cartão removido com sucesso."
}
```

---

## Consultar Transações Recentes

Retorna as últimas transações realizadas com um cartão.

### Endpoint

```http
GET /cartoes/{id}/transacoes-recentes
```

### Exemplo

```http
GET /cartoes/1/transacoes-recentes
```

### Exemplo de Resposta

```json
[
  {
    "id": 101,
    "valor": 150.00,
    "descricao": "Compra Mercado",
    "data": "2026-06-14T10:00:00Z"
  },
  {
    "id": 102,
    "valor": 49.90,
    "descricao": "Streaming",
    "data": "2026-06-13T21:30:00Z"
  }
]
```

---

# Códigos de Resposta

| Código | Descrição |
|----------|------------|
| 200 | Operação realizada com sucesso |
| 201 | Recurso criado com sucesso |
| 400 | Dados inválidos |
| 401 | Usuário não autenticado |
| 403 | Usuário sem permissão |
| 404 | Recurso não encontrado |
| 500 | Erro interno do servidor |

---

# Fluxo Básico

1. Solicitar um cartão.
2. Consultar os cartões da conta.
3. Buscar detalhes de um cartão específico.
4. Alterar o status quando necessário.
5. Consultar transações recentes.
6. Excluir o cartão caso seja cancelado.
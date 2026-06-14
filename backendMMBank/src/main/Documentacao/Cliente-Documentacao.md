# API de Clientes

Base URL:
```text
http://localhost:8080
```

---

## Listar Clientes

**GET** `/clientes`

Retorna todos os clientes cadastrados.

### Response

```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "role": "ROLE_USER",
    "documento": "123.456.789-00",
    "telefone": "+5521999999999"
  }
]
```

---

## Buscar Cliente

**GET** `/clientes/{id}`

Retorna um cliente pelo seu ID.

### Exemplo

```text
GET /clientes/1
```

### Response

```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "role": "ROLE_USER",
  "documento": "123.456.789-00",
  "telefone": "+5521999999999"
}
```

---

## Atualizar Cliente

**PUT** `/clientes/{id}`

Atualiza os dados de um cliente existente.

### Exemplo

```text
PUT /clientes/1
```

### Request

```json
{
  "nome": "João Silva",
  "telefone": "+5521999999999",
  "endereco": "Rua das Flores, 123",
  "rendaMensal": 5000.00,
  "profissao": "Engenheiro"
}
```

### Response

```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "role": "ROLE_USER",
  "documento": "123.456.789-00",
  "telefone": "+5521999999999"
}
```

---

## Excluir Cliente

**DELETE** `/clientes/{id}`

Remove um cliente do sistema.

### Exemplo

```text
DELETE /clientes/1
```

### Response

```text
204 No Content
```

---

# Estrutura de Cliente

```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "role": "ROLE_USER",
  "documento": "123.456.789-00",
  "telefone": "+5521999999999"
}
```

---

# Roles (UserRole)

```text
ROLE_USER
ROLE_ADMIN
```
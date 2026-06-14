# API de Chaves Pix

Base URL:
```text
http://localhost:8080
```

> Todos os endpoints exigem autenticação. O email do usuário é extraído automaticamente do token.

---

## Cadastrar Chave Pix

**POST** `/api/pix/chaves`

Cadastra uma nova chave Pix para a conta autenticada.

### Request
```json
{
  "tipo": "CPF",
  "valor": "123.456.789-00"
}
```

### Regras
* O usuário deve estar autenticado.
* Para chaves do tipo `EMAIL` ou `TELEFONE`, o cadastro exige verificação.
* Para os demais tipos (`CPF`, `ALEATORIA`, etc.), o cadastro é imediato.

### Response (cadastro imediato)
```text
201 Created
```
```json
{
  "id": 1,
  "tipo": "CPF",
  "valor": "123.456.789-00",
  "contaId": 10
}
```

### Response (com verificação)
```text
202 Accepted
```
```json
{
  "verificationId": 42
}
```

---

## Confirmar Verificação

**POST** `/api/pix/chaves/confirm`

Confirma o código recebido e efetiva o cadastro de chaves `EMAIL` ou `TELEFONE`.

### Request
```json
{
  "verificationId": 42,
  "codigo": "123456"
}
```

### Regras
* O `verificationId` deve ter sido gerado por um cadastro pendente do próprio usuário.
* O código deve ser válido.

### Response
```json
{
  "id": 1,
  "tipo": "EMAIL",
  "valor": "usuario@email.com",
  "contaId": 10
}
```

---

## Alterar Chave Pix

**PUT** `/api/pix/chaves/{id}`

Atualiza uma chave Pix pertencente ao usuário autenticado.

### Exemplo
```text
PUT /api/pix/chaves/1
```

### Request
```json
{
  "tipo": "TELEFONE",
  "valor": "+5521999999999"
}
```

### Response
```json
{
  "id": 1,
  "tipo": "TELEFONE",
  "valor": "+5521999999999",
  "contaId": 10
}
```

---

## Listar Minhas Chaves

**GET** `/api/pix/chaves/minhas`

Retorna todas as chaves Pix da conta autenticada.

### Response
```json
[
  {
    "id": 1,
    "tipo": "CPF",
    "valor": "123.456.789-00",
    "contaId": 10
  }
]
```

---

## Excluir Chave Pix

**DELETE** `/api/pix/chaves/{id}`

Remove uma chave Pix pertencente ao usuário autenticado.

### Exemplo
```text
DELETE /api/pix/chaves/1
```

### Response
```text
204 No Content
```

---

# Estrutura de Chave Pix
```json
{
  "id": 1,
  "tipo": "EMAIL",
  "valor": "usuario@email.com",
  "contaId": 10
}
```

---

# Tipos de Chave (TipoChavePix)
```text
CPF
TELEFONE
EMAIL
ALEATORIA
```

## Verificação obrigatória
```text
EMAIL
TELEFONE
```

## Cadastro imediato
```text
CPF
ALEATORIA
```

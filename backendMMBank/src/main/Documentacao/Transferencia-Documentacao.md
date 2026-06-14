# API de Transferências

Base URL:
```text
http://localhost:8080
```

---

## Realizar Transferência (TED)

**POST** `/transferencias`

Realiza uma transferência do tipo `TRANSFERENCIA` (TED) entre contas.

### Request
```json
{
  "contaOrigemId": 1,
  "contaDestinoId": 2,
  "valor": 500.00
}
```

### Regras
* A conta de origem deve existir e estar ativa.
* A conta de destino deve existir.
* O tipo da transação é definido automaticamente como `TRANSFERENCIA`.

### Response
```text
201 Created
```
```json
{
  "id": 1,
  "contaOrigemId": 1,
  "contaDestinoId": 2,
  "valor": 500.00,
  "tipo": "TRANSFERENCIA",
  "dataHora": "2026-06-14T10:00:00"
}
```

---

## Realizar Transferência via Pix

**POST** `/transferencias/pix`

Realiza uma transferência do tipo `PIX_ENVIADO`.

### Request
```json
{
  "contaOrigemId": 1,
  "contaDestinoId": 2,
  "valor": 500.00
}
```

### Regras
* A conta de origem deve existir e estar ativa.
* A conta de destino deve existir.
* O tipo da transação é definido automaticamente como `PIX_ENVIADO`.

### Response
```text
201 Created
```
```json
{
  "id": 2,
  "contaOrigemId": 1,
  "contaDestinoId": 2,
  "valor": 500.00,
  "tipo": "PIX_ENVIADO",
  "dataHora": "2026-06-14T10:00:00"
}
```

---

## Buscar Transferência

**GET** `/transferencias/{id}`

Retorna uma transferência pelo seu ID.

### Exemplo
```text
GET /transferencias/1
```

---

## Listar Transferências por Conta

**GET** `/transferencias/conta/{contaId}`

Retorna todas as transferências vinculadas à conta.

### Exemplo
```text
GET /transferencias/conta/1
```

### Response
```json
[
  {
    "id": 1,
    "contaOrigemId": 1,
    "contaDestinoId": 2,
    "valor": 500.00,
    "tipo": "TRANSFERENCIA",
    "dataHora": "2026-06-14T10:00:00"
  }
]
```

---

# Tipos de Transação (TipoTransacao)

```text
TRANSFERENCIA
PIX_ENVIADO
```

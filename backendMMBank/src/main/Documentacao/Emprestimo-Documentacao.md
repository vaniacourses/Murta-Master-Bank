# API de Empréstimos

Base URL:

```text
http://localhost:8080
```

---

## Criar Empréstimo

**POST** `/emprestimos`

Cria um empréstimo para uma conta existente.

### Request

```json
{
  "valorTotal": 1000.00,
  "quantidadeParcelas": 5,
  "contaId": 1
}
```

### Regras

* Conta deve existir.
* Conta não pode estar BLOQUEADA ou ENCERRADA.
* Taxa de juros fixa de 5%.
* Parcelas são geradas automaticamente.
* Status inicial do empréstimo: `ATIVO`.

### Response

```json
{
  "id": 1,
  "valorTotal": 1000.00,
  "taxaJuros": 0.05,
  "quantidadeParcelas": 5,
  "dataInicio": "2026-06-04",
  "status": "ATIVO",
  "parcelas": [...]
}
```

---

## Buscar Empréstimo

**GET** `/emprestimos/{id}`

Retorna um empréstimo com suas parcelas.

### Exemplo

```text
GET /emprestimos/1
```

---

## Listar Empréstimos

**GET** `/emprestimos`

Retorna todos os empréstimos cadastrados.

---

## Buscar Empréstimos por Conta

**GET** `/emprestimos/conta/{contaId}`

Retorna todos os empréstimos vinculados à conta.

### Exemplo

```text
GET /emprestimos/conta/1
```

### Response

```json
[
  {
    "id": 1,
    "valorTotal": 1000.00,
    "status": "ATIVO",
    "parcelas": [...]
  }
]
```

---

## Excluir Empréstimo

**DELETE** `/emprestimos/{id}`

Remove o empréstimo e suas parcelas.

### Exemplo

```text
DELETE /emprestimos/1
```

### Response

```text
204 No Content
```

---

# Parcelas

## Pagar Parcela

**PATCH** `/parcelas/{id}/pagar`

Registra o pagamento de uma parcela.

### Exemplo

```text
PATCH /parcelas/1/pagar
```

### Regras

* A parcela deve existir.
* Uma parcela não pode ser paga duas vezes.
* O sistema registra automaticamente:

    * status = PAGO
    * dataPagamento = data atual

### Regra de Quitação

Quando todas as parcelas do empréstimo forem pagas:

```text
StatusEmprestimo = QUITADO
```

### Response

```text
204 No Content
```

---

# Estrutura de Parcela

```json
{
  "id": 1,
  "numero": 1,
  "valor": 210.00,
  "dataVencimento": "2026-07-04",
  "dataPagamento": null,
  "status": "PENDENTE"
}
```

---

# Status

## Empréstimo

```text
ATIVO
QUITADO
```

## Parcela

```text
PENDENTE
PAGO
ATRASADO
```

## Conta

```text
ATIVA
BLOQUEADA
ENCERRADA
```

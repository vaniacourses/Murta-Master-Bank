# API Acadêmica — Rodar Back-end

## Pré-requisitos

- [Java 21](https://www.oracle.com/java/technologies/downloads/#java21)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)

---

## Passos

**1.** Abra o IntelliJ → **File → Open** → selecione a pasta `api-mmb_rep`.

**2.** **File → Settings → Build, Execution, Deployment → Compiler → Annotation Processors** → marque **"Enable annotation processing"** → OK.

**3.** **File → Project Structure → Project** → confirme que o SDK é **Java 21** (se já estiver, não altere) → OK.

**4.** **Settings → Plugins** → pesquise **Lombok** → instale → reinicie o IntelliJ.

**5.** Abra `ApiMmbApplication.java` em `src/main/java` → clique no triângulo verde ao lado do `main` → **Run**.

Quando aparecer no console:
```
Started ApiMmbApplication in X.XXX seconds
```
O servidor está rodando em **http://localhost:8080**.

---

## Banco de dados (H2)

Acesse **http://localhost:8080/h2-console** e preencha:

| Campo      | Valor                    |
|------------|--------------------------|
| JDBC URL   | `jdbc:h2:mem:academiadb` |
| User Name  | `sa`                     |
| Password   | *(vazio)*                |

> O banco é em memória — os dados são apagados toda vez que o servidor para. Isso é esperado em desenvolvimento e será trocado para arquivo quando terminarmos.

---

## Dependências

`Spring Web` · `Spring Data JPA` · `H2 Database` · `Spring Boot DevTools` · `Validation` · `Lombok`
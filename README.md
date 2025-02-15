# Chat API

Este projeto é uma API de chat construída com Node.js, Express, TypeScript, e PostgreSQL. Ele utiliza `Socket.IO` para comunicação em tempo real e `knex.js` para gerenciar migrações do banco de dados.

## Estrutura do Projeto

- **src/**: Contém o código-fonte da aplicação.
  - **controllers/**: Controladores que lidam com as requisições HTTP.
  - **models/**: Modelos que interagem com o banco de dados.
  - **routes/**: Define as rotas da API.
  - **services/**: Contém a lógica de negócios.
  - **types/**: Define tipos TypeScript usados na aplicação.
- **migrations/**: Scripts de migração para criar tabelas no banco de dados.
- **.env**: Arquivo de configuração de variáveis de ambiente.
- **docker-compose.yml**: Configuração do Docker para o banco de dados PostgreSQL.
- **knexfile.js**: Configuração do `knex` para migrações.
- **package.json**: Lista de dependências e scripts do projeto.
- **tsconfig.json**: Configuração do TypeScript.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Configuração

1. **Clone o repositório:**

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd chat-api
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure o arquivo `.env`:**

   Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

   ```plaintext
   POSTGRES_USER=chatuser
   POSTGRES_PASSWORD=chatpassword
   POSTGRES_DB=chatdb
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   ```

4. **Suba o banco de dados com Docker:**

   Certifique-se de que o Docker está rodando e execute:

   ```bash
   docker-compose up -d
   ```

5. **Execute as migrações do banco de dados:**

   ```bash
   npm run migrate
   ```

6. **Inicie o servidor:**

   Para iniciar o servidor em modo de desenvolvimento com `nodemon`:

   ```bash
   npm run dev
   ```

   Ou para iniciar o servidor em modo de produção:

   ```bash
   npm run start
   ```

## Uso

- A API estará disponível em `http://localhost:3000`.
- Use ferramentas como Postman para testar os endpoints REST.
- A comunicação em tempo real pode ser testada com um cliente Socket.IO.

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento.
- `npm run start`: Inicia o servidor em modo de produção.
- `npm run migrate`: Executa as migrações do banco de dados.
- `npm run rollback`: Reverte a última migração.

## Contribuição

Sinta-se à vontade para abrir issues e pull requests para melhorias e correções.


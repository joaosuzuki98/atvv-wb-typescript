# Como rodar o projeto
Faça clone do projeto, na raiz rode o seguinte comando para baixar as dependẽncias:

```shell
npm i
```

Para rodar o servidor, rode o comando:

```shell
npx nodemon server.js
```

Alternativamente, você pode rodar:

```shell
node server.js
```

# Criando os models
Para criar a tabela usando o prisma, primeiro crie um arquivo .env, nele você deve colocar o endereço do seu banco de dados, exemplo:

```env
DATABASE_URL="mysql://meu_usuario:minha_senha@localhost:3306/nome_do_banco"
```

Agora você pode crias as migrações e migrá-las com o comando:

```shell
npx prisma migrate dev --save init
```

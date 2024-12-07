Rode os seguintes comandos, tanto no front quanto no back:
```
npm i
```

No back, crie um arquivo .env e coloque o seguinte conteúdo:
```
DATABASE_URL="mysql://your_user:your_password@localhost:3306/db_name"
```

Para rodar o back:
```
node server.ts
```

Para rodar o front:
```
npm start
```
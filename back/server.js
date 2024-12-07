const app = require('./app/index')
const PORT = 3001

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`)
})

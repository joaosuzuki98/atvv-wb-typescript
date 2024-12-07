const express = require('express')
const apiRoutes = require('./routes/api')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(apiRoutes)

module.exports = app
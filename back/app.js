const express = require('express')
const cors = require('cors')
const debug = require('debug')('app:main')

const { UsersAPI } = require('./src/users')
const { IndexAPI, NotFoundAPI } = require('./src/index/index')
const { AccountsAPI } = require('./src/accounts')
const { TransactionAPI } = require('./src/transactions')
const { Config } = require('./src/config/config')

const app = express()
app.use(express.json())
// cors policy
app.use(cors())

app.get('/ping', (req, res) => {
  res.send('pong')
})

IndexAPI(app)
UsersAPI(app)
AccountsAPI(app)
TransactionAPI(app)
NotFoundAPI(app)

// modulos

app.listen(Config.port, () => {
  debug(`Servidor levantado en http://localhost:${Config.port}`)
})

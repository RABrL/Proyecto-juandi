const express = require('express')
const { AccountsController } = require('./controller')
const router = express.Router()

module.exports.AccountsAPI = (app) => {
  router
    .get('/', AccountsController.getAllAccounts) // http://localhost:3000/api/accounts/
    .get('/:user_id', AccountsController.getAccountByUserId) // http://localhost:3000/api/accounts/1
    .post('/', AccountsController.createAccount)

  app.use('/api/accounts', router)
}

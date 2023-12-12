const express = require('express')
const { TransactionController } = require('./controller')
const router = express.Router()

module.exports.TransactionAPI = (app) => {
  router
    .get('/:id', TransactionController.getTransactionById) // http://localhost:3000/api/trransaction/1
    .get('/account/:user_id', TransactionController.getAllTransactionsByUserId) // http://localhost:3000/api/transaction/account/1
    .put('/deposit/:account_id', TransactionController.deposit) // http://localhost:3000/api/transaction/deposit/1
    .put('/withdraw/:account_id', TransactionController.withdraw) // http://localhost:3000/api/transaction/withdraw/1
    .put('/transfer/:account_id', TransactionController.transfer) // http://localhost:3000/api/transaction/transfer/1
    .put('/reverse/:reference', TransactionController.reverse) // http://localhost:3000/api/transaction/reverse/1

  app.use('/api/transaction', router)
}

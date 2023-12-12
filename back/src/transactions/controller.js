const debug = require('debug')('app:module-transaction-controller')
const { Response } = require('../helpers/response')
const { TransactionService } = require('./services')

module.exports.TransactionController = {
  getTransactionById: async (req, res) => {
    try {
      const { id } = req.params
      const result = await TransactionService.getById(id)
      if (!result.success) return Response.error(res, result.error)
      Response.success(res, 200, result.message, result.data)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  getAllTransactionsByUserId: async (req, res) => {
    try {
      const { user_id } = req.params
      const result = await TransactionService.getAllByUserId(user_id)
      if (!result.success) {
        return Response.error(res, result.error)
      }
      Response.success(res, 200, result.message, result.data)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  deposit: async (req, res) => {
    try {
      const { account_id } = req.params
      const { amount } = req.body
      const result = await TransactionService.deposit(account_id, amount)
      if (!result.success) {
        return Response.error(res, result.error)
      }
      Response.success(res, 200, result.message)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  withdraw: async (req, res) => {
    try {
      const { account_id } = req.params
      const { amount } = req.body
      const result = await TransactionService.withdraw(account_id, amount)
      if (!result.success) {
        return Response.error(res, result.error)
      }
      Response.success(res, 200, result.message)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  transfer: async (req, res) => {
    try {
      const { account_id } = req.params
      const { amount, receptor_id } = req.body
      const result = await TransactionService.transfer(
        account_id,
        receptor_id,
        amount
      )
      if (!result.success) {
        return Response.error(res, result.error)
      }
      Response.success(res, 200, result.message)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  reverse: async (req, res) => {
    try {
      const { reference } = req.params
      const result = await TransactionService.reverse(reference)
      if (!result.success) {
        return Response.error(res, result.error)
      }
      Response.success(res, 200, result.message)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  }
}

const debug = require('debug')('app:module-accounts-controller')
const { Response } = require('../helpers/response')
const { AccountServices } = require('./services')
const createError = require('http-errors')

module.exports.AccountsController = {
  getAllAccounts: async (req, res) => {
    try {
      const result = await AccountServices.getAll()
      Response.success(res, 200, 'Lista de cuentas', result.data)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  getAccountByUserId: async (req, res) => {
    try {
      const { user_id } = req.params
      const result = await AccountServices.getByUserId(user_id)
      if (!result.success) return Response.error(res, result.error)
      Response.success(res, 200, result.message, result.data)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  createAccount: async (req, res) => {
    try {
      const { user_id, balance } = req.body
      const result = await AccountServices.create({ user_id, balance })

      if (!result.success) {
        return Response.error(res, result.error)
      }

      Response.success(res, 200, `Cuenta ${id} agregada`)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  }
}

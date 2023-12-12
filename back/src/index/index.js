const express = require('express')
const createError = require('http-errors')
const { Response } = require('../helpers/response')

module.exports.IndexAPI = (app) => {
  const router = express.Router()

  router.get('/', (req, res) => {
    const menu = {
      users: `https://${req.headers.host}/api/users`,
      accounts: `https://${req.headers.host}/api/accounts`,
      transactions: `https://${req.headers.host}/api/transactions`
    }

    Response.success(res, 200, 'API Doc', menu)
  })

  app.use('/', router)
}

module.exports.NotFoundAPI = (app) => {
  const router = express.Router()

  router.all('*', (req, res) => {
    Response.error(res, new createError.NotFound())
  })

  app.use('/', router)
}

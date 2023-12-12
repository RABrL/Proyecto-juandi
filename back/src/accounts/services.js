const joi = require('joi')
const models = require('../models')

const createError = require('http-errors')

async function getAll() {
  const accounts = await models.accounts.findAll()
  return {
    success: true,
    message: 'Lista de cuentas',
    data: accounts
  }
}

async function getById(id) {
  const account = await models.accounts.findOne({ where: { id } })
  if (!account)
    return {
      success: false,
      error: new createError.NotFound('No se encontro la cuenta')
    }
  return {
    success: true,
    message: 'Cuenta encontrada',
    data: account
  }
}

async function getByUserId(user_id) {
  const account = await models.accounts.findOne({ where: { user_id } })
  if (!account)
    return {
      success: false,
      error: new createError.NotFound(
        `No existe una cuenta para el usuario ${user_id}`
      )
    }
  return {
    success: true,
    message: 'Cuenta encontrada',
    data: account
  }
}

async function create({ user_id, balance, options = {} }) {
  const schema = joi.object({
    user_id: joi.number().required(),
    balance: joi.number().required()
  })
  const validation = schema.validate({ user_id, balance })
  if (validation.error) {
    return {
      success: false,
      error: new createError.BadRequest(validation.error.details[0].message)
    }
  }

  try {
    await models.accounts.create(
      {
        user_id,
        balance
      },
      options
    )
  } catch (error) {
    return {
      success: false,
      error: new createError.InternalServerError()
    }
  }

  return {
    success: true,
    message: 'Account created'
  }
}

module.exports.AccountServices = {
  create,
  getAll,
  getByUserId,
  getById
}

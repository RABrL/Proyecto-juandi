const Joi = require('joi')
const bcrypt = require('bcrypt')
const models = require('../models')

const createError = require('http-errors')
const { AccountServices } = require('../accounts/services')

async function getAll() {
  const users = await models.users.findAll()
  return {
    success: true,
    message: 'Lista de usuarios',
    data: users
  }
}

async function getById(id) {
  const user = await models.users.findOne({ where: { id } })
  if (!user)
    return {
      success: false,
      error: new createError.NotFound('No se encontro el usuario')
    }
  return {
    success: true,
    message: 'Usuario encontrado',
    data: user
  }
}

async function getByUsername(username, options = {}) {
  const user = await models.users.findOne({ where: { username } }, options)
  if (!user)
    return {
      success: false,
      error: new createError.NotFound(`No se encontro al usuario ${username}`)
    }
  return {
    success: true,
    message: 'Usuario encontrado',
    data: user
  }
}

async function login(username, password) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })

  const validation = schema.validate({ username, password })

  if (validation.error) {
    return {
      success: false,
      error: new createError.BadRequest(validation.error.details[0].message)
    }
  }

  const user = await getByUsername(username)

  if (!user.success) {
    return {
      success: false,
      error: user.error
    }
  }

  if (!bcrypt.compareSync(password, user.data.password)) {
    return {
      success: false,
      error: new createError.Unauthorized('Password incorrect')
    }
  }

  return {
    success: true,
    message: 'Usuario logueado',
    data: {
      username: user.data.dataValues.username,
      id: user.data.dataValues.id
    }
  }
}

async function create(username, password) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })

  const validation = schema.validate({ username, password })

  if (validation.error) {
    return {
      success: false,
      error: new createError.BadRequest(validation.error.details[0].message)
    }
  }
  const t = await models.sequelize.transaction()

  try {
    const existingUser = await getByUsername(username, { transaction: t })

    if (existingUser.success) {
      return {
        success: false,
        error: new createError.Conflict('User already exists')
      }
    }

    const user = await models.users.create(
      {
        username,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      },
      {
        transaction: t
      }
    )

    try {
      await AccountServices.create({
        user_id: user.id,
        balance: 5000000,
        options: { transaction: t }
      })
    } catch (error) {
      await t.rollback()
      return {
        success: false,
        error: new createError.InternalServerError(
          'Error creando la cuenta del usuario'
        )
      }
    }

    await t.commit()

    return {
      success: true,
      message: 'User account created'
    }
  } catch (error) {
    await t.rollback()
    return {
      success: false,
      error: new createError.InternalServerError()
    }
  }
}
module.exports.UsersService = {
  create,
  getAll,
  getById,
  login,
  getByUsername
}

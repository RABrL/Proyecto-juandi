const debug = require('debug')('app:module-users-controller')
const { Response } = require('../helpers/response')
const { UsersService } = require('./services')

module.exports.UsersController = {
  getAllUsers: async (req, res) => {
    try {
      const result = await UsersService.getAll()
      if (!result.success) return Response.error(res, result.error)
      Response.success(res, 200, result.message, result.data)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  getUserById: async (req, res) => {
    try {
      const {
        params: { id }
      } = req
      const result = await UsersService.getById(id)
      if (!result.success) return Response.error(res, result.error)
      Response.success(res, 200, result.message, result.data)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  getUserByUsername: async (req, res) => {
    try {
      const {
        params: { username }
      } = req
      const result = await UsersService.getByUsername(username)
      if (!result.success) return Response.error(res, result.error)
      Response.success(res, 200, result.message, result.data)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  createUser: async (req, res) => {
    try {
      const {
        body: { username, password }
      } = req

      const result = await UsersService.create(username, password)

      if (!result.success) {
        return Response.error(res, result.error)
      }

      Response.success(res, 201, `Usuario ${username} agregado`)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  },
  login: async (req, res) => {
    try {
      const {
        body: { username, password }
      } = req

      const result = await UsersService.login(username, password)
      if (!result.success) {
        return Response.error(res, result.error)
      }
      Response.success(res, 200, result.message, result.data)
    } catch (error) {
      debug(error)
      Response.error(res)
    }
  }
}

const express = require('express')
const { UsersController } = require('./controller')
const router = express.Router()

module.exports.UsersAPI = (app) => {
  router
    .get('/', UsersController.getAllUsers) // http://localhost:3000/api/users/
    .get('/:id', UsersController.getUserById) // http://localhost:3000/api/users/1
    .get('/name/:username', UsersController.getUserByUsername) // http://localhost:3000/api/users/name/pepe')
    .post('/', UsersController.createUser)
    .post('/login', UsersController.login)

  app.use('/api/users', router)
}

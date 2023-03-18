const express = require('express')
const {registerUser, LoginUser, forgotPassword, resetPassword, getUserDetails} = require('../Controller/userController')

const routes = express.Router()

routes.route('/user/new').post(registerUser)

routes.route('/user/login').post(LoginUser)

routes.route('/password/forgot').post(forgotPassword)

routes.route('/password/reset/:token').put(resetPassword)


module.exports = routes;
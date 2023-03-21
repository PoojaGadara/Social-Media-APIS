const express = require('express')
const {registerUser, LoginUser, forgotPassword, resetPassword,userLogout} = require('../Controller/userController')

const routes = express.Router()

routes.route('/user/new').post(registerUser)

routes.route('/user/login').post(LoginUser)

routes.route('/password/forgot').post(forgotPassword)

routes.route('/password/reset/:token').put(resetPassword)

routes.route('/user/logout').get(userLogout)


module.exports = routes;
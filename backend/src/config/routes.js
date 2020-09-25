const express = require('express')
const auth = require('./auth')

module.exports = function (server) {
	const protectedApi = express.Router()
	const openApi = express.Router()    
	protectedApi.use(auth)
	
	/*
	* Rotas protegidas por Token JWT
	*/
	
	server.use('/api', protectedApi)
	
	/*
	* Rotas abertas
	*/
	
	server.use('/oapi', openApi)

	const AuthService = require('../api/user/authService')
	const ResetPassword = require('../api/resetPassword/resetPassword')
	openApi.post('/user/login', AuthService.login)
	openApi.post('/user/signup', AuthService.signup)
	openApi.post('/user/validateToken', AuthService.validateToken)
	openApi.post('/resetPassword/sendEmail', ResetPassword.sendResetPasswordEmail)
	openApi.post('/resetPassword/changePassword', ResetPassword.changePassword)
}
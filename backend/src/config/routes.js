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

	const User = require('../api/user/userService')
	protectedApi.get('/user/:nickname', User.getUserByNickname)
	protectedApi.put('/user/:nickname', User.updateUser)

	const Match = require('../api/match/matchService');
	protectedApi.put('/match/create', Match.createMatch)
	protectedApi.get('/matches/:nickname', Match.listMyMatches)
	protectedApi.delete('/match/delete/:id', Match.deleteMatch)

	const PublicMatches = require('../api/publicMatches/publicMatchesService');
	protectedApi.get('/publicMatches/list', PublicMatches.listPublicMatches);
	protectedApi.post('/publicMatches/join', PublicMatches.joinPublicMatch);

	
	/*
	* Rotas abertas
	*/
	
	server.use('/oapi', openApi)

	const AuthService = require('../api/user/authService')
	openApi.post('/user/login', AuthService.login)
	openApi.post('/user/signup', AuthService.signup)
	openApi.post('/user/validateToken', AuthService.validateToken)
	
	const ResetPassword = require('../api/resetPassword/resetPassword')
	openApi.post('/resetPassword/sendEmail', ResetPassword.sendResetPasswordEmail)
	openApi.post('/resetPassword/changePassword', ResetPassword.changePassword)
}
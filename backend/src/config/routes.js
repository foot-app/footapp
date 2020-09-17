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
}
const _ = require('lodash')
const Match = require('./match');
const dbErrors = require('../common/sendErrorsFromDb')
const changesObjUtils = require('../common/populateChangesObj');
const mongooseFunctions = require('../common/mongooseFunctions');

const createMatch = async (req, res, next) => {
    const changesObj = {}
    const propertiesName = Object.getOwnPropertyNames(req.body)
    const requiredFields = ['name', 'street', 'number', 'neighborhood', 'city', 'state', 'date']
    const mapRequiredFields = { name: 'nome', street: 'rua', number: 'número', neighborhood: 'bairro', city: 'cidade', state: 'estado', date: 'data e horário' }

    await changesObjUtils.populateChangesObj(propertiesName, changesObj, ['schedule'], req)

    for (let i = 0; i < requiredFields.length; i++) {
        let fieldName = requiredFields[i]
        if (!changesObj[fieldName]) {
            return res.status(400).send({ errors: [`O preenchimento do campo ${mapRequiredFields[fieldName]} é obrigatório`]})
        }
    }

    const newMatch = new Match(Object.assign({}, changesObj));
    return await mongooseFunctions.save(newMatch, 'Partida cadastrada com sucesso!', res)
}

const listMyMatches = async (req, res, next) => {
    await Match.find({ownerNickname: req.params.nickname}, (err, matches) => {
        if(err) {
            return sendErrorsFromDB(res, err)
        } 
        else if(matches) {
            return res.status(200).json(matches)
        }
        else {
            return res.status(200).json([])
        }
    })
}

const deleteMatch = async (req, res, next) => {
    const matchId = req.params.id;
    Match.deleteOne({ _id: matchId}, (err, result) => {
        if(err) {
            return sendErrorsFromDB(res, err)
        }
        else if(result.n === 1 && result.ok === 1) {
            return res.status(200).json({ message: 'Partida excluída com sucesso!'})
        }
        else if(result.n === 0) {
            return res.status(400).json({erros: ['Partida não encontrada!']})
        }
    })
 
}


const sendErrorsFromDB = (res, dbErrors) => {
    const errors = []

    _.forIn(dbErrors.errors, error => errors.push(error.message))
    return res.status(400).json({
        errors
    })
}

module.exports = { createMatch, listMyMatches, deleteMatch }

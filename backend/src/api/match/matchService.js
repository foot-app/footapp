const _ = require('lodash')
const Match = require('./match');
const dbErrors = require('../common/sendErrorsFromDb')
const changesObjUtils = require('../common/populateChangesObj')

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
    newMatch.save(err => {
        if(err) {
            return dbErrors.sendErrorsFromDB(res, err)
        }
        else {
            return res.status(200).json({ message: 'Partida cadastrada com sucesso!' })
        }
    })
}

module.exports = { createMatch }
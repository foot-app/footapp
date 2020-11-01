const _ = require('lodash')
const Match = require('./match');

const createMatch = (req, res, next) => {

    const changesObj = {}
    const propertiesName = Object.getOwnPropertyNames(req.body)

    propertiesName.forEach(propertieName => {
        if (propertieName != 'schedule') {
            changesObj[propertieName] = req.body[propertieName]
        }
    })

    if(!changesObj.name) {
        return res.status(400).send({ errors: ['O preenchimento do campo nome é obrigatório']})
    }

    if(!changesObj.street) {
        return res.status(400).send({ errors: ['O preenchimento do campo rua é obrigatório']})
    }

    if(!changesObj.number) {
        return res.status(400).send({ errors: ['O preenchimento do campo número é obrigatório']})
    }

    if(!changesObj.neighborhood) {
        return res.status(400).send({ errors: ['O preenchimento do campo bairro é obrigatório']})
    }

    if(!changesObj.city) {
        return res.status(400).send({ errors: ['O preenchimento do campo cidade é obrigatório']})
    }

    if(!changesObj.state) {
        return res.status(400).send({ errors: ['O preenchimento do campo estado é obrigatório']})
    }

    if(!changesObj.date) {
        return res.status(400).send({ errors: ['O preenchimento do campo data e horário é obrigatório']})
    }

    const newMatch = new Match(Object.assign({}, changesObj));
    newMatch.save(err => {
        if(err) {
            return sendErrorsFromDB(res, err)
        }
        else {
            return res.status(200).json({ message: 'Partida cadastrada com sucesso!' })
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

module.exports = { createMatch }
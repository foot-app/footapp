const _ = require('lodash')
const User = require('./user')
const bcrypt = require('bcrypt')

const sendErrorsFromDB = (res, dbErrors) => {
    const errors = []

    if (dbErrors.err > 1) {
        _.forIn(dbErrors.err, error => errors.push(error.message))
    }
    else {
        errors.push(dbErrors.message)
    }
    
    return res.status(400).json({
        errors
    })
}

const getUserByNickname = (req, res, next) => {
    const nickname = req.params.nickname

    User.findOne({ nickname }, (error, user) => {
        if (error) {
            return sendErrorsFromDB(res, error)
        }
        else if (!user) {
            return res.status(400).json({ errors: ['Usuário não encontrado'] })
        }
        else {
            const userData = {
                name: user.name,
                email: user.email,
                nickname: user.nickname,
                height: user.height,
                weight: user.weight,
                preferredFoot: user.preferredFoot
            }
            return res.status(200).json({ userData })
        }
    })
}

const updateUser = async (req, res, next) => {
    const nickname = req.params.nickname
    const changesObj = {}
    const propertiesName = Object.getOwnPropertyNames(req.body)

    propertiesName.forEach(propertieName => {
        if (propertieName != 'password_confirmation') {
            changesObj[propertieName] = req.body[propertieName]
        }
    })

    if (changesObj.nickname != nickname) {
        await User.findOne({ nickname: changesObj.nickname }, (error, user) => {
            if (error) {
                return sendErrorsFromDB(res, error)
            }
            else if (user) {
                return res.status(400).json({ errors: ['Nome de usuário já cadastrado'] })
            }
            else {
                User.findOne({ nickname }, (error, user) => {
                    if (error) {
                        return sendErrorsFromDB(res, error)
                    }
                    else if (!user) {
                        return res.status(400).json({ errors: ['Usuário não encontrado'] })
                    }
                    else {
                        User.findOneAndUpdate({ nickname }, changesObj, (error, user) => {
                            if (error) {
                                return sendErrorsFromDB(res, error)
                            }
                            else {
                                return res.status(200).json({ message: 'Informações alteradas com sucesso', data: user })
                            }
                        })
                    }
                })
            }
        })
    }
    else {
        User.findOne({ nickname }, (error, user) => {
            if (error) {
                return sendErrorsFromDB(res, error)
            }
            else if (!user) {
                return res.status(400).json({ errors: ['Usuário não encontrado'] })
            }
            else {
                User.findOneAndUpdate({ nickname }, changesObj, (error, user) => {
                    if (error) {
                        return sendErrorsFromDB(res, error)
                    }
                    else {
                        return res.status(200).json({ message: 'Informações alteradas com sucesso', data: user })
                    }
                })
            }
        })
    }
}

module.exports = { getUserByNickname, updateUser }
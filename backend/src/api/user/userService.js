const User = require('./user')
const dbErrors = require('../common/sendErrorsFromDb')
const changesObjUtils = require('../common/populateChangesObj')

const getUserByNickname = (req, res, next) => {
    const nickname = req.params.nickname

    User.findOne({ nickname }, (error, user) => {
        if (error) {
            return dbErrors.sendErrorsFromDB(res, error)
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
                preferredFoot: user.preferredFoot,
                profilePicture: user.profilePicture
            }
            return res.status(200).json({ userData })
        }
    })
}

const updateUser = async (req, res, next) => {
    const nickname = req.params.nickname
    const changesObj = {}
    const propertiesName = Object.getOwnPropertyNames(req.body)

    await changesObjUtils.populateChangesObj(propertiesName, changesObj, ['password_confirmation'], req)

    if (changesObj.nickname != nickname) {
        await User.findOne({ nickname: changesObj.nickname }, (error, user) => {
            if (error) {
                return dbErrors.sendErrorsFromDB(res, error)
            }
            else if (user) {
                return res.status(400).json({ errors: ['Nome de usuário já cadastrado'] })
            }
            else {
                User.findOne({ nickname }, (error, user) => {
                    if (error) {
                        return dbErrors.sendErrorsFromDB(res, error)
                    }
                    else if (!user) {
                        return res.status(400).json({ errors: ['Usuário não encontrado'] })
                    }
                    else {
                        User.findOneAndUpdate({ nickname }, changesObj, (error, user) => {
                            if (error) {
                                return dbErrors.sendErrorsFromDB(res, error)
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
                return dbErrors.sendErrorsFromDB(res, error)
            }
            else if (!user) {
                return res.status(400).json({ errors: ['Usuário não encontrado'] })
            }
            else {
                User.findOneAndUpdate({ nickname }, changesObj, (error, user) => {
                    if (error) {
                        return dbErrors.sendErrorsFromDB(res, error)
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
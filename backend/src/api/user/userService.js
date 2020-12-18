const User = require('./user')
const dbErrors = require('../common/sendErrorsFromDb')
const changesObjUtils = require('../common/populateChangesObj')
const mongooseFunctions = require('../common/mongooseFunctions')

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
                profilePicture: user.profilePicture,
                fut7Positions: user.fut7Positions,
                futsalPositions: user.futsalPositions
            }
            return res.status(200).json({ userData })
        }
    })
}

const findOneAndUpdate = async (nickname, changesObj, res) => {
    return await mongooseFunctions.findOneAndUpdate(User, { nickname: nickname }, changesObj, res)
}

const updateDifferentNickname = async (nickname, changesObj, res) => {
    await User.findOne({ nickname: changesObj.nickname }, (error, user) => {
        if (error) {
            return dbErrors.sendErrorsFromDB(res, error)
        }
        else if (user) {
            return res.status(400).json({ errors: ['Nome de usuário já cadastrado'] })
        }
        else {
            User.findOne({ nickname }, async (error, user) => {
                if (error) {
                    return dbErrors.sendErrorsFromDB(res, error)
                }
                else if (!user) {
                    return res.status(400).json({ errors: ['Usuário não encontrado'] })
                }
                else {
                    return await findOneAndUpdate(nickname, changesObj, res) 
                }
            })
        }
    })
}

const updateSameNickname = async (nickname, changesObj, res) => {
    User.findOne({ nickname }, async (error, user) => {
        if (error) {
            return dbErrors.sendErrorsFromDB(res, error)
        }
        else if (!user) {
            return res.status(400).json({ errors: ['Usuário não encontrado'] })
        }
        else {
            return await findOneAndUpdate(nickname, changesObj, res)
        }
    })
}

const updateUser = async (req, res, next) => {
    const nickname = req.params.nickname
    const changesObj = {}
    const propertiesName = Object.getOwnPropertyNames(req.body)

    await changesObjUtils.populateChangesObj(propertiesName, changesObj, ['password_confirmation'], req)

    if (changesObj.nickname != nickname) {
        return await updateDifferentNickname(nickname, changesObj, res)
    }
    else {
        return await updateSameNickname(nickname, changesObj, res)
    }
}

const getUsersByQuery = async (req, res, next) => {
    const value = req.params.value || ''
    const valueExp = new RegExp(value, 'i')
    const query = { $or: [{ name: valueExp }, { email: valueExp }, { nickname: valueExp }]}
    User.find(query, (error, users) => {
        if (!users || users.length <= 0) {
            return res.status(200).json({ errors: ['Nenhum usuário não encontrado'] })
        }
        else {
            return res.status(200).json({ users })
        }
    })
}

module.exports = { getUserByNickname, updateUser, getUsersByQuery }
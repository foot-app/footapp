const User = require('../user/user')
const FriendshipRequest = require('./friendshipRequest')
const dbErrors = require('../common/sendErrorsFromDb')
const friendshipRequestUtils = require('./friendshipRequestUtils')
const mongooseFunctions = require('../common/mongooseFunctions')

const getFriendshipRequests = async (req, res, next) => {
    const targetUserNickname = req.params.nickname
    return await friendshipRequestUtils.findFriendshipRequest({ targetUserNickname }, 'Nenhuma solicitação de amizade encontrada', res)
}

const getFriendshipRequestById = (req, res, next) => {
    const friendshipRequestId = req.params.id || ''
    
    FriendshipRequest.findOne({ '_id': friendshipRequestId }, (error, friendshipRequest) => {
        if (!friendshipRequest)
            return res.status(200).json({ message: 'Solicitação de amizade não encontrada' })
        else
            return res.status(200).json({ friendshipRequest })
    })
}

const sendFriendshipRequest = async (req, res, next) => {
    const targetUserNickname = req.body.targetUserNickname || ''
    const requesterUserNickname = req.body.requesterUserNickname || ''
    const errorReturnStatement = { statusCode: 400, errors: [] }

    if (!targetUserNickname || !requesterUserNickname) 
        return res.status(400).json({ errors: ['Parâmetros não foram informados corretamente'] })

    const targetUserExists = await friendshipRequestUtils.findUser(targetUserNickname)
    const requesterUserExists = await friendshipRequestUtils.findUser(requesterUserNickname)

    if (targetUserExists == false || requesterUserExists == false)
        errorReturnStatement.errors.push('Usuários informados não foram encontrados')
    if (await friendshipRequestUtils.friendshipRequestExists(targetUserNickname, requesterUserNickname))
        errorReturnStatement.errors.push('Solicitação de amizade já enviada')
    if (errorReturnStatement.errors.length > 0)
        return res.status(errorReturnStatement.statusCode).json({ errors: errorReturnStatement.errors })

    const friendshipRequest = new FriendshipRequest({ targetUserNickname, requesterUserNickname, status: 'pending' })
    return await mongooseFunctions.save(friendshipRequest, 'Solicitação de amizade enviada com sucesso', res)
}

const cancelFriendship = async (req, res, next) => {
    const friendshipRequestId = req.params.id || ''

    FriendshipRequest.deleteOne({ '_id': friendshipRequestId }, (errors) => {
        if (errors)
            return dbErrors.sendErrorsFromDB(res, errors)
        else
            return res.status(200).json({ message: 'Amizade cancelada com sucesso' })
    })
}

const acceptFriendshipRequest = async (req, res, next) => {
    const friendshipRequestId = req.params.id || ''
    const newStatus = req.body.status

    if (!friendshipRequestId || !newStatus)
        return res.status(400).json({ errors: ['Parâmetros não foram fornecidos corretamente'] })

    return await mongooseFunctions.findOneAndUpdate(FriendshipRequest, { '_id': friendshipRequestId }, { status: newStatus }, res)
}

const getFriendship = async (req, res, next) => {
    const nickname = req.params.nickname
    const query = { $and: [ { status: 'accepted' }, { $or: [{ targetUserNickname: nickname }, { requesterUserNickname: nickname }] }]}
    return await friendshipRequestUtils.findFriendshipRequest(query, 'Nenhuma amizade encontrada', res)
}

module.exports = { getFriendshipRequests, getFriendshipRequestById, sendFriendshipRequest, cancelFriendship, acceptFriendshipRequest, getFriendship }
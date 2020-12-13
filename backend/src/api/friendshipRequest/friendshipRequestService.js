const User = require('../user/user')
const FriendshipRequest = require('./friendshipRequest')
const dbErrors = require('../common/sendErrorsFromDb')
const friendshipRequestUtils = require('./friendshipRequestUtils')
const mongooseFunctions = require('../common/mongooseFunctions')

const getFriendshipRequests = (req, res, next) => {
    const targetUserNickname = req.params.nickname

    FriendshipRequest.find({ targetUserNickname }, (error, friendshipRequests) => {
        if (!friendshipRequests || friendshipRequests.length <= 0) {
            return res.status(200).json({ message: 'Nenhuma solicitação de amizade encontrada' })
        }
        else {
            return res.status(200).json({ friendshipRequests })
        }
    })
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

    if (!targetUserNickname || !requesterUserNickname) 
        return res.status(400).json({ errors: ['Parâmetros não foram informados corretamente'] })

    const targetUserExists = await friendshipRequestUtils.findUser(targetUserNickname)
    const requesterUserExists = await friendshipRequestUtils.findUser(requesterUserNickname)

    if (targetUserExists == false)
        return res.status(400).json({ errors: ['Usuário para quem está enviando a solicitação não foi encontrado'] })
    if (requesterUserExists == false)
        return res.status(400).json({ errors: ['Usuário solicitante não foi encontrado'] })

    if (await friendshipRequestUtils.friendshipRequestExists(targetUserNickname, requesterUserNickname))
        return res.status(400).json({ errors: ['Solicitação de amizade já enviada'] })

    const friendshipRequest = new FriendshipRequest({ targetUserNickname, requesterUserNickname, status: 'pending' })
    await friendshipRequest.save(async err => {
        if (err) {
            return dbErrors.sendErrorsFromDB(res, err)
        } else {
            return res.status(200).json({ message: 'Solicitação de amizade enviada com sucesso' })
        }
    })
}

const cancelFriendshipRequest = async (req, res, next) => {
    const friendshipRequestId = req.params.id || ''

    FriendshipRequest.deleteOne({ '_id': friendshipRequestId }, (errors) => {
        if (errors)
            return dbErrors.sendErrorsFromDB(res, errors)
        else
            return res.status(200).json({ message: 'Solicitação de amizade cancelada com sucesso' })
    })
}

const acceptFriendshipRequest = async (req, res, next) => {
    const friendshipRequestId = req.params.id || ''
    const newStatus = req.body.status

    if (!friendshipRequestId || !newStatus)
        return res.status(400).json({ errors: ['Parâmetros não foram fornecidos corretamente'] })

    return await mongooseFunctions.findOneAndUpdate(FriendshipRequest, { '_id': friendshipRequestId }, { status: newStatus }, res)
}

module.exports = { getFriendshipRequests, getFriendshipRequestById, sendFriendshipRequest, cancelFriendshipRequest, acceptFriendshipRequest }
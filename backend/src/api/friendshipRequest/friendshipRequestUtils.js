const User = require('../user/user')
const FriendshipRequest = require('./friendshipRequest')

const findUser = async nickname => {
    const user = await User.findOne({ nickname }).exec()

    return !!user
}

const friendshipRequestExists = async (targetUserNickname, requesterUserNickname) => {
    const friendshipRequest = await FriendshipRequest.findOne({ targetUserNickname, requesterUserNickname }).exec()

    return !!friendshipRequest
}

const findFriendshipRequest = async (query, noneFoundMessage, res) => {
    await FriendshipRequest.find(query, (error, friendshipRequests) => {
        if (!friendshipRequests || friendshipRequests.length <= 0) {
            return res.status(200).json({ message: noneFoundMessage })
        }
        else {
            return res.status(200).json({ friendshipRequests })
        }
    })
}

module.exports = { findUser, friendshipRequestExists, findFriendshipRequest }
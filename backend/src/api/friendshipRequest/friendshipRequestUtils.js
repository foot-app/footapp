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

module.exports = { findUser, friendshipRequestExists }
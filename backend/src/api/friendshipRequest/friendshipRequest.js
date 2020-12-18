const restful = require('node-restful')
const mongoose = restful.mongoose

const friendshipRequest = new mongoose.Schema({
    targetUserNickname: { type: String, required: true },
    requesterUserNickname: { type: String, required: true },
    status: { type: String, required: true, enum: ['pending', 'accepted'] }
})

module.exports = restful.model('FriendshipRequest', friendshipRequest)
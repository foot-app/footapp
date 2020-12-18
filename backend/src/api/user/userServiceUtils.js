const FriendshipRequest = require('../friendshipRequest/friendshipRequest')

const updateFriendshipRequestsNickname = async (currentNickname, newNickname) => {
    const query = { $or: [{ targetUserNickname: currentNickname }, { requesterUserNickname: currentNickname }] }
    await FriendshipRequest.find(query, async (error, friendshipRequests) => {
        if (friendshipRequests && friendshipRequests.length > 0) {
            await friendshipRequests.forEach(async request => {
                if (request.targetUserNickname == currentNickname)
                    await FriendshipRequest.findOneAndUpdate({ '_id': request._id }, { targetUserNickname: newNickname })
                else
                    await FriendshipRequest.findOneAndUpdate({ '_id': request._id }, { requesterUserNickname: newNickname })
            })
        }
    })

}

module.exports = { updateFriendshipRequestsNickname }
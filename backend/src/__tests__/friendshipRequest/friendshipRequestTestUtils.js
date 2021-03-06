const request = require('supertest')
const server = require('../../loader')

const sendFriendshipRequest = async (targetUserNickname, requesterUserNickname, token, statusCode, responseMessage, responseError) => {
    await request(server).post('/api/friendshipRequest')
        .set('authorization', token)
        .send({ targetUserNickname, requesterUserNickname })
        .expect(statusCode)
        .then(response => {
            if (responseMessage)
                expect(response.body.message).toEqual(responseMessage)
            if (responseError)
                expect(response.body.errors[0]).toEqual(responseError)
        })
}

const cancelFriendship = async (id, token, statusCode, responseMessage, responseError) => {
    await request(server).delete(`/api/friendshipRequest/${id}`)
        .set('authorization', token)
        .expect(statusCode)
        .then(response => {
            if (responseMessage)
                expect(response.body.message).toEqual(responseMessage)
            if (responseError)
                expect(response.body.errors[0]).toEqual(responseError)
        })
}

const acceptFriendshipRequest = async (id, token, statusCode, changeObj, responseMessage, responseError) => {
    await request(server).put(`/api/friendshipRequest/${id}`)
        .set('authorization', token)
        .send(changeObj)
        .expect(statusCode)
        .then(response => {
            if (responseMessage)
                expect(response.body.message).toEqual(responseMessage)
            if (responseError)
                expect(response.body.errors[0]).toEqual(responseError)
        })
}

const getFriendship = async (nickname, token, statusCode) => {
    return await request(server).get(`/api/friendships/${nickname}`)
        .set('authorization', token)
        .expect(statusCode)
}

module.exports = { sendFriendshipRequest, cancelFriendship, acceptFriendshipRequest, getFriendship }
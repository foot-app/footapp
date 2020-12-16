const utils = require('../utils')
const friendshipRequestTestUtils = require('./friendshipRequestTestUtils')
const request = require('supertest')
const User = require('../../api/user/user');
const FriendshipRequest = require('../../api/friendshipRequest/friendshipRequest')
const server = require('../../loader')
let app

const fakeFooUser = { name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' }
const fakeBarUser = { name: 'bar', email: 'bar@bar.com', nickname: 'bar123', password: 'Bar@123!', confirm_password: 'Bar@123!' }
const fakePopUser = { name: 'pop', email: 'pop@pop.com', nickname: 'pop123', password: 'Pop@123!', confirm_password: 'Pop@123!' }
const fakeFriendshipRequestFooBar = { targetUserNickname: 'foo123', requesterUserNickname: 'bar123', status: 'pending' }

beforeAll(async () => {
    await utils.connectMongoInMemory()
})

afterAll(async done => {
    await utils.disconnectMongoose(done)
})

describe('FriendshipRequest model test', () => {
    beforeAll(async () => {
        await FriendshipRequest.deleteMany({})
    })

    afterEach(async () => {
        await FriendshipRequest.deleteMany({})
    })

    it ('has a module', () => {
        expect(FriendshipRequest).toBeDefined()
    })

    describe('get friendshipRequest', () => {
        it('gets a friendshipRequest', async () => {
            await utils.getModel(FriendshipRequest, fakeFriendshipRequestFooBar, 'targetUserNickname', 'foo123', 'status', 'pending')
        })
    })

    describe('save FriendshipRequest', () => {
        it('saves a friendshipRequest', async () => {
            await utils.saveModel(FriendshipRequest, fakeFriendshipRequestFooBar, 'status', 'pending')
        })
    })

    describe('update FriendshipRequest', () => {
        it('updates a friendshipRequest', async () => {
            await utils.updateModel(FriendshipRequest, fakeFriendshipRequestFooBar, 'status', 'accepted')
        })
    })
})

describe('FriendshipRequest routes tests', () => {
    beforeAll(async () => {
        await utils.startServer()
        await utils.resetDB([User, FriendshipRequest])
    })

    afterAll(async done => {
        await utils.closeServer(done)
    })

    afterEach(async () => {
        await User.deleteMany({})
        await FriendshipRequest.deleteMany({})
    })

    describe('getFriendshipRequests', () => {
        it ('getFriendshipRequests successfully', async () => {
            await utils.signUp(200, fakeFooUser)
            await utils.signUp(200, fakeBarUser)
            const loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            await friendshipRequestTestUtils.sendFriendshipRequest(fakeBarUser.nickname, fakeFooUser.nickname, loginResponse.body.token, 200)
            await request(server).get(`/api/friendshipRequest/nickname/${fakeBarUser.nickname}`)
                .set('authorization', loginResponse.body.token)
                .expect(200)
                .then(response => {
                    expect(response.body.friendshipRequests.length).toEqual(1)
                })
        })

        it ('getFriendshipRequests successfully - no FriendshipRequest found', async () => {
            await utils.signUp(200, fakeFooUser)
            const loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            await request(server).get(`/api/friendshipRequest/nickname/${fakeBarUser.nickname}`)
                .set('authorization', loginResponse.body.token)
                .expect(200)
                .then(response => {
                    expect(response.body.message).toEqual('Nenhuma solicitação de amizade encontrada')
                })
        })
    })

    describe('getFriendshipRequestById', () => {
        it ('getFriendshipRequestById successfully', async () => {
            await utils.signUp(200, fakeFooUser)
            await utils.signUp(200, fakeBarUser)
            const loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            await friendshipRequestTestUtils.sendFriendshipRequest(fakeBarUser.nickname, fakeFooUser.nickname, loginResponse.body.token, 200)
            await request(server).get(`/api/friendshipRequest/nickname/${fakeBarUser.nickname}`)
                .set('authorization', loginResponse.body.token)
                .expect(200)
                .then(async response => {
                    expect(response.body.friendshipRequests.length).toEqual(1)
                    const id = response.body.friendshipRequests[0]._id
                    await request(server).get(`/api/friendshipRequest/${id}`)
                        .set('authorization', loginResponse.body.token)
                        .expect(200)
                        .then(response => {
                            expect(response.body.friendshipRequest._id).toEqual(id)
                        })
                })
        })

        it ('getFriendshipRequestById successfully - no FriendshipRequest located', async () => {
            await utils.signUp(200, fakeFooUser)
            const loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            await request(server).get(`/api/friendshipRequest/teste`)
                .set('authorization', loginResponse.body.token)
                .expect(200)
                .then(response => {
                    expect(response.body.message).toEqual('Solicitação de amizade não encontrada')
                })
        })

        it ('getFriendshipRequestById fail - missing id', async () => {
            await utils.signUp(200, fakeFooUser)
            await utils.signUp(200, fakeBarUser)
            const loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            await friendshipRequestTestUtils.sendFriendshipRequest(fakeBarUser.nickname, fakeFooUser.nickname, loginResponse.body.token, 200)
            await request(server).get(`/api/friendshipRequest/${''}`)
                .set('authorization', loginResponse.body.token)
                .expect(404)
        })
    })

    describe('sendFriendshipRequest', () => {
        it ('sendFriendshipRequest successfully', async () => {
            await utils.signUp(200, fakeFooUser)
            await utils.signUp(200, fakeBarUser)
            const loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            await friendshipRequestTestUtils.sendFriendshipRequest(fakeBarUser.nickname, fakeFooUser.nickname, loginResponse.body.token, 200)
        })

        it ('sendFriendshipRequest fail - no targetUserNickname', async () => {
            await utils.signUp(200, fakeFooUser)
            await utils.signUp(200, fakeBarUser)
            const loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            await friendshipRequestTestUtils.sendFriendshipRequest('', fakeFooUser.nickname, loginResponse.body.token, 400, '', 'Parâmetros não foram informados corretamente')
        })

        it ('sendFriendshipRequest fail - no requesterUserNickname', async () => {
            await utils.signUp(200, fakeFooUser)
            await utils.signUp(200, fakeBarUser)
            const loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            await friendshipRequestTestUtils.sendFriendshipRequest(fakeBarUser.nickname, '', loginResponse.body.token, 400, '', 'Parâmetros não foram informados corretamente')
        })

        it ('sendFriendshipRequest fail - targetUser does not exist', async () => {
            await utils.signUp(200, fakeFooUser)
            const loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            await friendshipRequestTestUtils.sendFriendshipRequest(fakeBarUser.nickname, fakeFooUser.nickname, loginResponse.body.token, 400, '', 'Usuários informados não foram encontrados')
        })

        it ('sendFriendshipRequest fail - requesterUser does not exist', async () => {
            await utils.signUp(200, fakeBarUser)
            const loginResponse = await utils.login(fakeBarUser.email, fakeBarUser.password)
            await friendshipRequestTestUtils.sendFriendshipRequest(fakeBarUser.nickname, fakeFooUser.nickname, loginResponse.body.token, 400, '', 'Usuários informados não foram encontrados')
        })

        it ('sendFriendshipRequest fail - FriendshipRequest already sent', async () => {
            await utils.signUp(200, fakeFooUser)
            await utils.signUp(200, fakeBarUser)
            const loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            await friendshipRequestTestUtils.sendFriendshipRequest(fakeBarUser.nickname, fakeFooUser.nickname, loginResponse.body.token, 200)
            await friendshipRequestTestUtils.sendFriendshipRequest(fakeBarUser.nickname, fakeFooUser.nickname, loginResponse.body.token, 400, '', 'Solicitação de amizade já enviada')
        })
    })

    describe('cancelFriendship', () => {
        it ('cancelFriendship successfully', async () => {
            await utils.signUp(200, fakeFooUser)
            await utils.signUp(200, fakeBarUser)
            const loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            const loginResponseToken = loginResponse.body.token
            await friendshipRequestTestUtils.sendFriendshipRequest(fakeBarUser.nickname, fakeFooUser.nickname, loginResponseToken, 200)
            const sendResponse = await request(server).get(`/api/friendshipRequest/nickname/${fakeBarUser.nickname}`)
                .set('authorization', loginResponseToken)
                .expect(200)
            await friendshipRequestTestUtils.cancelFriendship(sendResponse.body.friendshipRequests[0]._id, loginResponseToken, 200, 'Amizade cancelada com sucesso', '')
        })

        it ('cancelFriendship fail - missing id', async () => {
            await utils.signUp(200, fakeFooUser)
            await utils.signUp(200, fakeBarUser)
            const loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            const loginResponseToken = loginResponse.body.token
            await friendshipRequestTestUtils.sendFriendshipRequest(fakeBarUser.nickname, fakeFooUser.nickname, loginResponseToken, 200)
            const sendResponse = await request(server).get(`/api/friendshipRequest/nickname/${fakeBarUser.nickname}`)
                .set('authorization', loginResponseToken)
                .expect(200)
            await friendshipRequestTestUtils.cancelFriendship('', loginResponseToken, 404)
        })

        it ('cancelFriendship fail - wrong id', async () => {
            await utils.signUp(200, fakeFooUser)
            await utils.signUp(200, fakeBarUser)
            const loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            const loginResponseToken = loginResponse.body.token
            await friendshipRequestTestUtils.sendFriendshipRequest(fakeBarUser.nickname, fakeFooUser.nickname, loginResponseToken, 200)
            const sendResponse = await request(server).get(`/api/friendshipRequest/nickname/${fakeBarUser.nickname}`)
                .set('authorization', loginResponseToken)
                .expect(200)
            await friendshipRequestTestUtils.cancelFriendship('test', loginResponseToken, 400, '', 'Cast to ObjectId failed for value "test" at path "_id" for model "FriendshipRequest"')
        })
    })

    describe('acceptFriendshipRequest', () => {
        it ('acceptFriendshipRequest successfully', async () => {
            let loginResponse
            await utils.signUp(200, fakeFooUser)
            await utils.signUp(200, fakeBarUser)
            loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            await friendshipRequestTestUtils.sendFriendshipRequest(fakeBarUser.nickname, fakeFooUser.nickname, loginResponse.body.token, 200)
            loginResponse = await utils.login(fakeBarUser.email, fakeBarUser.password)
            const sendResponse = await request(server).get(`/api/friendshipRequest/nickname/${fakeBarUser.nickname}`)
                .set('authorization', loginResponse.body.token)
                .expect(200)
            await friendshipRequestTestUtils.acceptFriendshipRequest(sendResponse.body.friendshipRequests[0]._id, loginResponse.body.token, 200, { status: 'accepted' }, 'Informações alteradas com sucesso', '')
        })

        it ('acceptFriendshipRequest fail - missing id', async () => {
            let loginResponse
            await utils.signUp(200, fakeFooUser)
            await utils.signUp(200, fakeBarUser)
            loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            await friendshipRequestTestUtils.sendFriendshipRequest(fakeBarUser.nickname, fakeFooUser.nickname, loginResponse.body.token, 200)
            loginResponse = await utils.login(fakeBarUser.email, fakeBarUser.password)
            const sendResponse = await request(server).get(`/api/friendshipRequest/nickname/${fakeBarUser.nickname}`)
                .set('authorization', loginResponse.body.token)
                .expect(200)
            await friendshipRequestTestUtils.acceptFriendshipRequest('', loginResponse.body.token, 404, { status: 'accepted' }, '', '')
        })

        it ('acceptFriendshipRequest fail - missing new status', async () => {
            let loginResponse
            await utils.signUp(200, fakeFooUser)
            await utils.signUp(200, fakeBarUser)
            loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            await friendshipRequestTestUtils.sendFriendshipRequest(fakeBarUser.nickname, fakeFooUser.nickname, loginResponse.body.token, 200)
            loginResponse = await utils.login(fakeBarUser.email, fakeBarUser.password)
            const sendResponse = await request(server).get(`/api/friendshipRequest/nickname/${fakeBarUser.nickname}`)
                .set('authorization', loginResponse.body.token)
                .expect(200)
            await friendshipRequestTestUtils.acceptFriendshipRequest(sendResponse.body.friendshipRequests[0]._id, loginResponse.body.token, 400, { status: '' }, '', 'Parâmetros não foram fornecidos corretamente')
        })
    })

    describe('getFriendship', () => {
        it ('getFriendship successfully', async () => {
            let loginResponse
            await utils.signUp(200, fakeFooUser)
            await utils.signUp(200, fakeBarUser)
            loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            await friendshipRequestTestUtils.sendFriendshipRequest(fakeBarUser.nickname, fakeFooUser.nickname, loginResponse.body.token, 200)
            loginResponse = await utils.login(fakeBarUser.email, fakeBarUser.password)
            const sendResponse = await request(server).get(`/api/friendshipRequest/nickname/${fakeBarUser.nickname}`)
                .set('authorization', loginResponse.body.token)
                .expect(200)
            await friendshipRequestTestUtils.acceptFriendshipRequest(sendResponse.body.friendshipRequests[0]._id, loginResponse.body.token, 200, { status: 'accepted' }, 'Informações alteradas com sucesso', '')
            const getFriendshipResponse = await friendshipRequestTestUtils.getFriendship(fakeBarUser.nickname, loginResponse.body.token, 200)
            expect(getFriendshipResponse.body.friendshipRequests.length).toEqual(1)
        })

        it ('getFriendship successfully - target view', async () => {
            let loginResponse
            await utils.signUp(200, fakeFooUser)
            await utils.signUp(200, fakeBarUser)
            loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            await friendshipRequestTestUtils.sendFriendshipRequest(fakeBarUser.nickname, fakeFooUser.nickname, loginResponse.body.token, 200)
            loginResponse = await utils.login(fakeBarUser.email, fakeBarUser.password)
            const sendResponse = await request(server).get(`/api/friendshipRequest/nickname/${fakeBarUser.nickname}`)
                .set('authorization', loginResponse.body.token)
                .expect(200)
            await friendshipRequestTestUtils.acceptFriendshipRequest(sendResponse.body.friendshipRequests[0]._id, loginResponse.body.token, 200, { status: 'accepted' }, 'Informações alteradas com sucesso', '')
            const getFriendshipResponse = await friendshipRequestTestUtils.getFriendship(fakeFooUser.nickname, loginResponse.body.token, 200)
            expect(getFriendshipResponse.body.friendshipRequests.length).toEqual(1)
        })

        it ('getFriendship successfully - no friendship found', async () => {
            let loginResponse
            await utils.signUp(200, fakeFooUser)
            await utils.signUp(200, fakeBarUser)
            loginResponse = await utils.login(fakeFooUser.email, fakeFooUser.password)
            await friendshipRequestTestUtils.sendFriendshipRequest(fakeBarUser.nickname, fakeFooUser.nickname, loginResponse.body.token, 200)
            loginResponse = await utils.login(fakeBarUser.email, fakeBarUser.password)
            const sendResponse = await request(server).get(`/api/friendshipRequest/nickname/${fakeBarUser.nickname}`)
                .set('authorization', loginResponse.body.token)
                .expect(200)
            const getFriendshipResponse = await friendshipRequestTestUtils.getFriendship(fakeFooUser.nickname, loginResponse.body.token, 200)
            expect(getFriendshipResponse.body.message).toEqual('Nenhuma amizade encontrada')
        })
    })
})

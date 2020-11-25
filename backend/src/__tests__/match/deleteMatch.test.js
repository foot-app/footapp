const utils = require('../utils')
const request = require('supertest')
const Match = require('../../api/match/match')
const User = require('../../api/user/user')
const server = require('../../loader')
var mongoose = require('mongoose');
const { iteratee } = require('lodash')
let app

const fakeUser = { name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' }
const fakeMatch = { name: 'partidaTeste', rentAmount: '500', matchType: 'fut7', creatorHasBall: 'false', creatorHasVest: 'false', goalkeeperPays: 'false', street: 'a', number: '1', neighborhood: 'b', city: 'c', state: 'c', date: new Date(2020,11, 12,19,30,0), ownerNickname: 'nickteste' }

const createUserAndLogin = () => {
    return new Promise(async resolve => {
        await utils.signUp(200, fakeUser)
        await request(server).post('/oapi/user/login')
            .send({ email: 'foo@foo.com', password: 'Foo@123!' })
            .expect(200)
            .then(response => {
                resolve(response.body.token)
            })
    })
}

const sendDeleteMatchRequisition = (token, matchId) => {
    return new Promise(async resolve => {
        const res = await request(server)
            .put('/api/match/delete')
            .set('authorization', token)
            .send({matchId})
        resolve(res)
    })
}

beforeAll(async () => {
    await utils.connectMongoInMemory()
})

afterAll(async done => {
    await utils.disconnectMongoose(done)
})

describe('delete match routes test', () => {
    beforeAll(async () => {
        await utils.startServer()
        await utils.resetDB([Match, User])
    })

    afterAll(async done => {
        utils.closeServer(done)
    })

    afterEach(async () => {
        await Match.deleteMany({})
        await User.deleteMany({})
    })

    describe('delete match tests', () => {
        it('can delete match', async() => {
            const token =  await createUserAndLogin();
            const savedModel = await utils.saveModel(Match, fakeMatch, 'ownerNickname', 'nickteste')
            const res = await sendDeleteMatchRequisition(token, savedModel._id)
            expect(res.status).toEqual(200)
        })

        it('can\'t delete match - match id not found', async() => {
            const token = await createUserAndLogin();
            const savedModel = await utils.saveModel(Match, fakeMatch, 'ownerNickname', 'nickteste')
            let changedId = new mongoose.mongo.ObjectId("111111111111111111111111")
            const res = await sendDeleteMatchRequisition(token, changedId)
            expect(res.status).toEqual(400)
        })

        it('can\t delete match - send wrong variable as id - type is not a ObjectId', async() => {
            const token = await createUserAndLogin();
            const savedModel = await utils.saveModel(Match, fakeMatch, 'ownerNickname', 'nickteste')
            const res = await sendDeleteMatchRequisition(token, '111')
            expect(res.status).toEqual(400)
        })
    })
})
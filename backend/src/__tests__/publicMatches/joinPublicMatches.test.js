const mongoose = require('mongoose')
const request = require('supertest')
const Match = require('../../api/match/match')
const User = require('../../api/user/user')
const { MongoMemoryServer } = require('mongodb-memory-server');
const server = require('../../loader');
const { iteratee } = require('lodash');
let app
var mongoServer

const fakePublicMatch = { name: 'partidaTeste', rentAmount: 500, matchType: 'fut7', creatorHasBall: false, creatorHasVest: false, goalkeeperPays: false, street: 'a', number: '1', neighborhood: 'b', city: 'c', state: 'c', date: new Date(2020,11, 12,19,30,0), ownerNickname: 'foo123', isAPrivateMatch: false };
const fakePrivateMatch = { name: 'partidaTeste2', rentAmount: 500, matchType: 'fut7', creatorHasBall: false, creatorHasVest: false, goalkeeperPays: false, street: 'a', number: '1', neighborhood: 'b', city: 'c', state: 'c', date: new Date(2020,11, 12,19,30,0), ownerNickname: 'foo123', isAPrivateMatch: true }

const createUserAndLogin = () => {
    return new Promise(async resolve => {
        await request(server).post('/oapi/user/signup')
            .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
            .expect(200)
        await request(server).post('/oapi/user/login')
            .send({ email: 'foo@foo.com', password: 'Foo@123!' })
            .expect(200)
            .then(response => {
                resolve(response.body.token)
            })
    })
}

const sendCreateMatchRequisition = (token, bodyRequisition) => {
    return new Promise(async resolve => {
        const res = await request(server)
            .put('/api/match/create')
            .set('authorization', token)
            .send(bodyRequisition)
        resolve(res)
    })
}

beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const URI = await mongoServer.getUri();

    mongoose.connect(URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
})

afterAll(async done => {
    mongoose.disconnect(done);
    await mongoServer.stop();
})

describe('public matches tests', () => {

    beforeAll(async () => {
        app = await server.listen(3001)
        await Match.deleteMany({})
        await User.deleteMany({})
    })

    afterAll(async done => {
        app.close(done)
    })

    afterEach(async () => {
        await Match.deleteMany({})
        await User.deleteMany({})
    })

    it('can join match', async() => {
        const token = await createUserAndLogin();
        const bodyRequisition = fakePublicMatch
        const res = await sendCreateMatchRequisition(token, bodyRequisition);
        const match = await Match.find({name: 'partidaTeste'})
        const user = await User.find({nickname: 'foo123'})
        await request(server).post('/api/publicMatches/join')
            .send({userNickname: 'foo123', matchId: match[0]._id})
            .set('authorization', token)
            .expect(200)
        const matchExpected = await Match.find({name: 'partidaTeste'})
        const userExpected = await User.find({nickname: 'foo123'})
        expect(matchExpected[0].participants[0]).toEqual(user[0]._id)
        expect(userExpected[0].matches[0]).toEqual(match[0]._id)
    })

    it('can\'t join match - user not found', async() => {
        const token = await createUserAndLogin();
        const bodyRequisition = fakePublicMatch
        const res = await sendCreateMatchRequisition(token, bodyRequisition);
        const match = await Match.find({name: 'partidaTeste'})
        await request(server).post('/api/publicMatches/join')
            .send({userNickname: 'bar123', matchId: match[0]._id})
            .set('authorization', token)
            .expect(400)
    })

    it('can\'t join match - match not found', async() => {
        const token = await createUserAndLogin();
        const bodyRequisition = fakePublicMatch
        const res = await sendCreateMatchRequisition(token, bodyRequisition);
        let id = new mongoose.mongo.ObjectId("111111111111111111111111")
        await request(server).post('/api/publicMatches/join')
            .send({userNickname: 'foo123', matchId: id})
            .set('authorization', token)
            .expect(400)
    })
})

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

    it('can list public matches - only public matches registered', async() => {
        const token = await createUserAndLogin();
        const bodyRequisition = fakePublicMatch
        const res = await sendCreateMatchRequisition(token, bodyRequisition);
        await request(server).get('/api/publicMatches/list')
            .set('authorization', token)
            .then(response => {
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            name: 'partidaTeste', rentAmount: 500, matchType: 'fut7', creatorHasBall: false, creatorHasVest: false, goalkeeperPays: false, street: 'a', number: 1, neighborhood: 'b', city: 'c', state: 'c', ownerNickname: 'foo123', isAPrivateMatch: false
                        })
                    ])
                )
            })
    })

    it('can list public matches - private match registered', async() => {
        const token = await createUserAndLogin();
        const bodyRequisition1 = fakePublicMatch
        const bodyRequisition2 = fakePrivateMatch
        const res1 = await sendCreateMatchRequisition(token, bodyRequisition1)
        const res2 = await sendCreateMatchRequisition(token, bodyRequisition2)
        await request(server).get('/api/publicMatches/list')
            .set('authorization', token)
            .then(response => {
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            name: 'partidaTeste', rentAmount: 500, matchType: 'fut7', creatorHasBall: false, creatorHasVest: false, goalkeeperPays: false, street: 'a', number: 1, neighborhood: 'b', city: 'c', state: 'c', ownerNickname: 'foo123', isAPrivateMatch: false
                        }),
                    ])
                )
                expect(response.body).toEqual(
                    expect.not.arrayContaining([
                        expect.objectContaining({
                            name: 'partidaTeste2', rentAmount: 500, matchType: 'fut7', creatorHasBall: false, creatorHasVest: false, goalkeeperPays: false, street: 'a', number: 1, neighborhood: 'b', city: 'c', state: 'c', ownerNickname: 'foo123', isAPrivateMatch: true
                        }),
                    ])
                )
            })
    })
})
const mongoose = require('mongoose')
const request = require('supertest')
const Match = require('../../api/match/match')
const User = require('../../api/user/user')
const { MongoMemoryServer } = require('mongodb-memory-server');
const server = require('../../loader');
const { iteratee } = require('lodash');
let app
var mongoServer

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

describe('my match routes test', () => {
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

    describe('list my matches tests', () => {
        it('can list my matches - one match registered ', async() => {
            const token = await createUserAndLogin();
            const bodyRequisition = { name: 'partidaTeste', rentAmount: 500, matchType: 'fut7', creatorHasBall: false, creatorHasVest: false, goalkeeperPays: false, street: 'a', number: '1', neighborhood: 'b', city: 'c', state: 'c', date: new Date(2020,11, 12,19,30,0), ownerNickname: 'foo123'}
            const res = await sendCreateMatchRequisition(token, bodyRequisition)
            await request(server).get('/api/matches/foo123')
                .set('authorization', token)
                .then(response => {
                    expect(response.body).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                name: 'partidaTeste', rentAmount: 500, matchType: 'fut7', creatorHasBall: false, creatorHasVest: false, goalkeeperPays: false, street: 'a', number: 1, neighborhood: 'b', city: 'c', state: 'c', date: "2020-12-12T22:30:00.000Z", ownerNickname: 'foo123'
                            })
                        ])
                    )
                })
        })

         it('can list my matches - more than one registered', async() => {
            const token = await createUserAndLogin();
            const bodyRequisition = { name: 'partidaTeste', rentAmount: 500, matchType: 'fut7', creatorHasBall: false, creatorHasVest: false, goalkeeperPays: false, street: 'a', number: '1', neighborhood: 'b', city: 'c', state: 'c', date: new Date(2020,11, 12,19,30,0), ownerNickname: 'foo123'}
            const res = await sendCreateMatchRequisition(token, bodyRequisition)
            const bodyRequisition2 = { name: 'partidaTeste2', rentAmount: 500, matchType: 'fut7', creatorHasBall: false, creatorHasVest: false, goalkeeperPays: false, street: 'a', number: '1', neighborhood: 'b', city: 'c', state: 'c', date: new Date(2020,11, 12,19,30,0), ownerNickname: 'foo123'}
            const res2 = await sendCreateMatchRequisition(token, bodyRequisition2)
            await request(server).get('/api/matches/foo123')
                .set('authorization', token)
                .then(response => {
                    expect(response.body).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                name: 'partidaTeste', rentAmount: 500, matchType: 'fut7', creatorHasBall: false, creatorHasVest: false, goalkeeperPays: false, street: 'a', number: 1, neighborhood: 'b', city: 'c', state: 'c', ownerNickname: 'foo123'
                            }),
                            expect.objectContaining({
                                name: 'partidaTeste2', rentAmount: 500, matchType: 'fut7', creatorHasBall: false, creatorHasVest: false, goalkeeperPays: false, street: 'a', number: 1, neighborhood: 'b', city: 'c', state: 'c', ownerNickname: 'foo123'
                            })
                        ])
                    )
                })
         })

         it('can list my matches - any match registered', async() => {
            const token = await createUserAndLogin();
            await request(server).get('/api/matches/foo123')
            .set('authorization', token)
            .then(response => {
                expect(response.body.length).toEqual(0)
            })
         })
    })
})
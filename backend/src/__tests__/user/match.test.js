const mongoose = require('mongoose')
const request = require('supertest')
const Match = require('../../api/match/match')
const User = require('../../api/user/user')
const { MongoMemoryServer } = require('mongodb-memory-server');
const server = require('../../loader');
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

describe('match model test', () => {

    beforeAll(async () => {
        await Match.deleteMany({})
    })

    afterEach(async () => {
        await Match.deleteMany({})
    })

    it ('has a module', () => {
        expect(Match).toBeDefined()
    })

    describe('get match', () => {
        it('gets a match', async () => {
            const match = new Match({ name: 'partidaTeste', rentAmount: '500', matchType: 'fut7', creatorHasBall: 'false',creatorHasVest: 'false', goalkeeperPays: 'false', street: 'a', number: '1', neighborhood: 'b', city: 'c', state: 'c', date: new Date(2020,11, 12,19,30,0), ownerNickname: 'nickteste' })
            await match.save()

            const foundMatch = await Match.findOne({ ownerNickname: 'nickteste'})
            const expected = 'nickteste'
            const actual = foundMatch.ownerNickname
            expect(actual).toEqual(expected)
        })
    })

    describe('save match', () => {
        it('saves a user', async () => {
            const match = new Match({ name: 'partidaTeste', rentAmount: '500', matchType: 'fut7', creatorHasBall: 'false',creatorHasVest: 'false', goalkeeperPays: 'false', street: 'a', number: '1', neighborhood: 'b', city: 'c', state: 'c', date: new Date(2020,11, 12,19,30,0), ownerNickname: 'nickteste' })
            const savedMatch = await match.save();
            const expected = 'nickteste'
            const actual = savedMatch.ownerNickname
            expect(actual).toEqual(expected)
        })
    })
       
    describe('update match', () => {
        it('update a match', async () => {
            const match = new Match({ name: 'partidaTeste', rentAmount: '500', matchType: 'fut7', creatorHasBall: 'false',creatorHasVest: 'false', goalkeeperPays: 'false', street: 'a', number: '1', neighborhood: 'b', city: 'c', state: 'c', date: new Date(2020,11, 12,19,30,0), ownerNickname: 'nickteste' })
            await match.save();
            match.name = 'partidaTesteChange'
            const updatedMatch = await match.save();

            const expected = 'partidaTesteChange'
            const actual = match.name
            expect(actual).toEqual(expected)
        })
    })
})

describe('match routes test', () => {
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

    describe('match create tests', () => {
        it('can create match', async() => {
            const token  = await createUserAndLogin();
            const bodyRequisition = { name: 'partidaTeste', rentAmount: '500', matchType: 'fut7', creatorHasBall: 'false',creatorHasVest: 'false', goalkeeperPays: 'false', street: 'a', number: '1', neighborhood: 'b', city: 'c', state: 'c', date: new Date(2020,11, 12,19,30,0), ownerNickname: 'nickteste', schedule: '13:30'}
            const res = await sendCreateMatchRequisition(token, bodyRequisition)
            expect(res.status).toEqual(200)
        })

        it('can\'t create match - name not included', async() => {
            const token  = await createUserAndLogin();
            const bodyRequisition = { name: '', rentAmount: '500', matchType: 'fut7', creatorHasBall: 'false',creatorHasVest: 'false', goalkeeperPays: 'false', street: 'a', number: '1', neighborhood: 'b', city: 'c', state: 'c', date: new Date(2020,11, 12,19,30,0), ownerNickname: 'nickteste' }
            const res = await sendCreateMatchRequisition(token, bodyRequisition)
            expect(res.status).toEqual(400)
        })

        it('can\'t create match - street not included', async() => {
            const token  = await createUserAndLogin();
            const bodyRequisition = { name: 'partidaTeste', rentAmount: '500', matchType: 'fut7', creatorHasBall: 'false',creatorHasVest: 'false', goalkeeperPays: 'false', street: '', number: '1', neighborhood: 'b', city: 'c', state: 'c', date: new Date(2020,11, 12,19,30,0), ownerNickname: 'nickteste' }
            const res = await sendCreateMatchRequisition(token, bodyRequisition)
            expect(res.status).toEqual(400)
        })

        it('can\'t create match - number not included', async() => {
            const token  = await createUserAndLogin();
            const bodyRequisition = { name: 'partidaTeste', rentAmount: '500', matchType: 'fut7', creatorHasBall: 'false',creatorHasVest: 'false', goalkeeperPays: 'false', street: 'a', number: '', neighborhood: 'b', city: 'c', state: 'c', date: new Date(2020,11, 12,19,30,0), ownerNickname: 'nickteste' }
            const res = await sendCreateMatchRequisition(token, bodyRequisition)
            expect(res.status).toEqual(400)
        })

        it('can\'t create match - neighborhood not included', async() => {
            const token  = await createUserAndLogin();
            const bodyRequisition = { name: 'partidaTeste', rentAmount: '500', matchType: 'fut7', creatorHasBall: 'false',creatorHasVest: 'false', goalkeeperPays: 'false', street: 'a', number: '1', neighborhood: '', city: 'c', state: 'c', date: new Date(2020,11, 12,19,30,0), ownerNickname: 'nickteste' }
            const res = await sendCreateMatchRequisition(token, bodyRequisition)
            expect(res.status).toEqual(400)
        })

        it('can\'t create match - city not included', async() => {
            const token  = await createUserAndLogin();
            const bodyRequisition = { name: 'partidaTeste', rentAmount: '500', matchType: 'fut7', creatorHasBall: 'false',creatorHasVest: 'false', goalkeeperPays: 'false', street: 'a', number: '1', neighborhood: 'a', city: '', state: 'c', date: new Date(2020,11, 12,19,30,0), ownerNickname: 'nickteste' }
            const res = await sendCreateMatchRequisition(token, bodyRequisition)
            expect(res.status).toEqual(400)
        })

        it('can\'t create match - state not included', async() => {
            const token  = await createUserAndLogin();
            const bodyRequisition = { name: 'partidaTeste', rentAmount: '500', matchType: 'fut7', creatorHasBall: 'false',creatorHasVest: 'false', goalkeeperPays: 'false', street: 'a', number: '1', neighborhood: 'a', city: 'a', state: '', date: new Date(2020,11, 12,19,30,0), ownerNickname: 'nickteste' }
            const res = await sendCreateMatchRequisition(token, bodyRequisition)
            expect(res.status).toEqual(400)
        })

        it('can\'t create match - date not included', async() => {
            const token  = await createUserAndLogin();
            const bodyRequisition = { name: 'partidaTeste', rentAmount: '500', matchType: 'fut7', creatorHasBall: 'false',creatorHasVest: 'false', goalkeeperPays: 'false', street: 'a', number: '1', neighborhood: 'a', city: 'a', state: 'a', date: null, ownerNickname: 'nickteste' }
            const res = await sendCreateMatchRequisition(token, bodyRequisition)
            expect(res.status).toEqual(400)
        })

        it('can\'t create match - wrong format date', async() => {
            const token  = await createUserAndLogin();
            const bodyRequisition = { name: 'partidaTeste', rentAmount: '500', matchType: 'fut7', creatorHasBall: 'false',creatorHasVest: 'false', goalkeeperPays: 'false', street: 'a', number: '1', neighborhood: 'a', city: 'a', state: 'a', date: 'a', ownerNickname: 'nickteste' }
            const res = await sendCreateMatchRequisition(token, bodyRequisition)
            expect(res.status).toEqual(400)
        })
    })
})
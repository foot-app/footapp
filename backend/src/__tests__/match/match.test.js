const utils = require('../utils')
const request = require('supertest')
const Match = require('../../api/match/match')
const User = require('../../api/user/user')
const server = require('../../loader')
let app

const fakeMatch = { name: 'partidaTeste', rentAmount: '500', matchType: 'fut7', creatorHasBall: 'false',creatorHasVest: 'false', goalkeeperPays: 'false', street: 'a', number: '1', neighborhood: 'b', city: 'c', state: 'c', date: new Date(2020,11, 12,19,30,0), ownerNickname: 'nickteste', isAPrivateMatch: false }
const fakeUser = { name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' }

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

const sendCreateMatchRequisition = (token, bodyRequisition) => {
    return new Promise(async resolve => {
        const res = await request(server)
            .put('/api/match/create')
            .set('authorization', token)
            .send(bodyRequisition)
        resolve(res)
    })
}

const createFailMatch = async (match) => {
    const token  = await createUserAndLogin();
    const bodyRequisition = match
    const res = await sendCreateMatchRequisition(token, bodyRequisition)
    expect(res.status).toEqual(400)
}

beforeAll(async () => {
    await utils.connectMongoInMemory()
})

afterAll(async done => {
    await utils.disconnectMongoose(done)
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
            await utils.getModel(Match, fakeMatch, 'ownerNickname', 'nickteste', 'ownerNickname', 'nickteste')
        })
    })

    describe('save match', () => {
        it('saves a user', async () => {
            await utils.saveModel(Match, fakeMatch, 'ownerNickname', 'nickteste')
        })
    })
       
    describe('update match', () => {
        it('update a match', async () => {
            await utils.updateModel(Match, fakeMatch, 'name', 'partidaTesteChange')
        })
    })
})

describe('match routes test', () => {
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

    describe('match create tests', () => {
        it('can create match', async() => {
            const token  = await createUserAndLogin();
            const bodyRequisition = { name: 'partidaTeste', rentAmount: '500', matchType: 'fut7', creatorHasBall: 'false',creatorHasVest: 'false', goalkeeperPays: 'false', street: 'a', number: '1', neighborhood: 'b', city: 'c', state: 'c', date: new Date(2020,11, 12,19,30,0), ownerNickname: 'nickteste', schedule: '13:30', isAPrivateMatch: false}
            const res = await sendCreateMatchRequisition(token, bodyRequisition)
            expect(res.status).toEqual(200)
        })

        it('can\'t create match - name not included', async() => {
            const matchWithoutName = fakeMatch
            matchWithoutName.name = ''
            await createFailMatch(matchWithoutName)
        })

        it('can\'t create match - street not included', async() => {
            const matchWithoutName = fakeMatch
            matchWithoutName.street = ''
            await createFailMatch(matchWithoutName)
        })

        it('can\'t create match - number not included', async() => {
            const matchWithoutName = fakeMatch
            matchWithoutName.number = ''
            await createFailMatch(matchWithoutName)
        })

        it('can\'t create match - neighborhood not included', async() => {
            const matchWithoutName = fakeMatch
            matchWithoutName.neighborhood = ''
            await createFailMatch(matchWithoutName)
        })

        it('can\'t create match - city not included', async() => {
            const matchWithoutName = fakeMatch
            matchWithoutName.city = ''
            await createFailMatch(matchWithoutName)
        })

        it('can\'t create match - state not included', async() => {
            const matchWithoutName = fakeMatch
            matchWithoutName.state = ''
            await createFailMatch(matchWithoutName)
        })

        it('can\'t create match - date not included', async() => {
            const matchWithoutName = fakeMatch
            matchWithoutName.date = ''
            await createFailMatch(matchWithoutName)
        })

        it('can\'t create match - wrong format date', async() => {
            const token  = await createUserAndLogin();
            const bodyRequisition = { name: 'partidaTeste', rentAmount: '500', matchType: 'fut7', creatorHasBall: 'false',creatorHasVest: 'false', goalkeeperPays: 'false', street: 'a', number: '1', neighborhood: 'a', city: 'a', state: 'a', date: 'a', ownerNickname: 'nickteste', isAPrivateMatch: false }
            const res = await sendCreateMatchRequisition(token, bodyRequisition)
            expect(res.status).toEqual(400)
        })
    })
})
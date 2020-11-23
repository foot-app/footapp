const utils = require('../utils')
const request = require('supertest')
const User = require('../../api/user/user')
const server = require('../../loader')
let app

const fakeUser = { name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', height: '170', weight: '70.0', preferredFoot: 'Direito', profilePicture: 'https://foo.com.br/image.png' }
const fakeUserSignup = { name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' }

const login = async (email, password, statusCode) => {
    await request(server).post('/oapi/user/login')
        .send({ email: email, password: password })
        .expect(statusCode)
}

const multipleSignup = async (arrayUsers, arrayStatusCode) => {
    let statusCodeIndex = 0
    await arrayUsers.forEach(async user => {
        await utils.signUp(arrayStatusCode[statusCodeIndex], user)
        statusCodeIndex++
    })
}

const registerUserAlreadyRegistered = async (fakeUser, attributeToChangeKey, attributeToChangeValue) => {
    const copyFakeUserSignup = Object.assign({}, fakeUser)
    copyFakeUserSignup[attributeToChangeKey] = attributeToChangeValue
    await multipleSignup([fakeUser, copyFakeUserSignup], [200, 400])
}

const cantGetUserByAttribute = async (fakeUser, statusCode, searchKey) => {
    const response = await autoSignupAndLogin(fakeUser)
    await request(server).get(`/api/user/${searchKey}`)
        .set('authorization', response.body.token)
        .expect(statusCode)
}

const autoSignupAndLogin = async (fakeUser) => {
    await utils.signUp(200, fakeUser)
    return await request(server).post('/oapi/user/login')
        .send({ email: fakeUser.email, password: fakeUser.password })
        .expect(200)
}

const signupWithInvalidData = async (statusCode, attributeToChangeKey, attributeToChangeValue) => {
    const copyFakeUserSignup = Object.assign({}, fakeUserSignup)
    await utils.signUp(statusCode, copyFakeUserSignup, attributeToChangeKey, attributeToChangeValue)
}

beforeAll(async () => {
    await utils.connectMongoInMemory()
})

afterAll(async done => {
    await utils.disconnectMongoose(done)
})

describe('user model test', () => {
    beforeAll(async () => {
        await User.deleteMany({})
    })

    afterEach(async () => {
        await User.deleteMany({})
    })

    it ('has a module', () => {
        expect(User).toBeDefined()
    })

    describe('get user', () => {
        it('gets a user', async () => {
            await utils.getModel(User, fakeUser, 'email', 'foo@foo.com', 'name', 'foo')
        })
    })

    describe('save user', () => {
        it('saves a user', async () => {
            await utils.saveModel(User, fakeUser, 'name', 'foo')
        })
    })

    describe('update user', () => {
        it('updates a user', async () => {
            await utils.updateModel(User, fakeUser, 'name', 'bar')
        })
    })
})

describe('user routes tests', () => {
    beforeAll(async () => {
        await utils.startServer()
        await utils.resetDB([User])
    })

    afterAll(async done => {
        await utils.closeServer(done)
    })

    afterEach(async () => {
        await User.deleteMany({})
    })

    describe('user login tests', () => {
        it ('can login', async () => {
            await utils.signUp(200, fakeUserSignup)
            await login('foo@foo.com', 'Foo@123!', 200)
        })

        it ('can\'t login - user not registered', async () => {
            await login('foo@foo.com', 'Foo@123!', 400)
        })

        it ('can\'t login - wrong password', async () => {
            await utils.signUp(200, fakeUserSignup)
            await login('foo@foo.com', 'Foo@123', 400)
        })

        it ('can\'t login - wrong email', async () => {
            await utils.signUp(200, fakeUserSignup)
            await login('foo@foo.co', 'Foo@123!', 400)
        })

        it ('can\'t login - wrong email and password', async () => {
            await utils.signUp(200, fakeUserSignup)
            await login('foo@foo.co', 'Foo@123', 400)
        })
    })

    describe('user signup tests', () => {
        it ('can signup', async () => {
            await utils.signUp(200, fakeUserSignup)
        })

        it ('can\'t signup - user already registered - email', async () => {
            registerUserAlreadyRegistered(fakeUserSignup, 'nickname', 'foo1234')
        })

        it ('can\'t signup - user already registered - nickname', async () => {
            registerUserAlreadyRegistered(fakeUserSignup, 'email', 'foo123@foo.com')
        })

        it ('can\'t signup - invalid email', async () => {
            await signupWithInvalidData(400, 'email', 'foofoo.com')
        })

        it ('can\'t signup - invalid password', async () => {
            await signupWithInvalidData(400, 'password', 'foo')
        })

        it ('can\'t signup - passwords fields don\'t match', async () => {
            await signupWithInvalidData(400, 'confirm_password', 'Foo@123')
        })

        it ('can\'t signup - no nickname', async () => {
            await signupWithInvalidData(400, 'nickname', '')
        })
    })

    describe('user validateToken tests', () => {
        it ('can validate', async () => {
            const response = await autoSignupAndLogin(fakeUserSignup)
            const token = response.body.token
            await request(server).post('/oapi/user/validateToken')
                .send({ token: token })
                .expect(200)
        })

        it ('can\'t validate - wrong token', async () => {
            await request(server).post('/oapi/user/validateToken')
                .send({ token: 'a' })
                .expect(200, { valid: false })
        })
    })

    describe('user getUserByNickname tests', () => {
        it ('can getUserByNickname', async () => {
            const response = await autoSignupAndLogin(fakeUserSignup)
            const token = response.body.token
            await request(server).get('/api/user/foo123')
                .set('authorization', token)
                .expect(200)
                .then(response => {
                    expect(response.body.userData.email).toEqual('foo@foo.com')
                })
        })

        it ('can\'t getUserByNickname - no nickname', async () => {
            await cantGetUserByAttribute(fakeUserSignup, 404, '')
        })

        it ('can\'t getUserByNickname - no authentication', async () => {
            const response = await autoSignupAndLogin(fakeUserSignup)
            await request(server).get('/api/user/foo123')
                .expect(403)
        })

        it ('can\'t getUserByNickname - user not found', async () => {
            await cantGetUserByAttribute(fakeUserSignup, 400, 'foo1234')
        })
    })

    describe('user updateUser tests', () => {
        const updateUser = async (token, nickname, statusCode) => {
            await request(server).put(`/api/user/${nickname}`)
                .set('authorization', token)
                .send({ height: 170, weight: 70, preferredFoot: 'Direito', profilePicture: 'https://foo.com.br/image.png' })
                .expect(statusCode)
        }

        it ('can updateUser', async () => {
            const response = await autoSignupAndLogin(fakeUserSignup)
            await updateUser(response.body.token, 'foo123', 200)
            await request(server).get('/api/user/foo123')
                .set('authorization', response.body.token)
                .expect(200)
                .then(response => {
                    expect(response.body.userData.height).toEqual(170)
                    expect(response.body.userData.weight).toEqual(70)
                    expect(response.body.userData.preferredFoot).toEqual('Direito')
                    expect(response.body.userData.profilePicture).toEqual('https://foo.com.br/image.png')
                })
        })

        it ('can\'t updateUser - user not found', async () => {
            const response = await autoSignupAndLogin(fakeUserSignup)
            await updateUser(response.body.token, 'foo1234', 400)
        })

        it ('can\'t updateUser - nickname already in use', async () => {
            await utils.signUp(200, fakeUserSignup)

            const secondUser = Object.assign({}, fakeUserSignup)
            secondUser.email = 'foo1234@foo.com'
            secondUser.nickname = 'foo1234'

            await utils.signUp(200, secondUser)
            await request(server).post('/oapi/user/login')
                .send({ email: 'foo@foo.com', password: 'Foo@123!', profilePicture: 'https://foo.com.br/image.png' })
                .expect(200)
                .then(response => {
                    token = response.body.token
                })
            await request(server).put('/api/user/foo123')
                .set('authorization', token)
                .send({ height: 170, weight: 70, preferredFoot: 'Direito', nickname: 'foo1234' })
                .expect(400)
        })
    })
})

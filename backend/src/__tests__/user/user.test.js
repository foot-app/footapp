const mongoose = require('mongoose')
const request = require('supertest')
const User = require('../../api/user/user')
const { MongoMemoryServer } = require('mongodb-memory-server');
const server = require('../../loader');
let app
var mongoServer

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
            const user = new User({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', height: '170', weight: '70.0', preferredFoot: 'Direito', profilePicture: 'https://foo.com.br/image.png' })
            await user.save()

            const foundUser = await User.findOne({ email: 'foo@foo.com'})
            const expected = 'foo'
            const actual = foundUser.name
            expect(actual).toEqual(expected)
        })
    })

    describe('save user', () => {
        it('saves a user', async () => {
            const user = new User({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', height: '170', weight: '70.0', preferredFoot: 'Direito', profilePicture: 'https://foo.com.br/image.png' })
            const savedUser = await user.save()
            const expected = 'foo'
            const actual = savedUser.name
            expect(actual).toEqual(expected)
        })
    })

    describe('update user', () => {
        it('updates a user', async () => {
            const user = new User({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', height: '170', weight: '70.0', preferredFoot: 'Direito', profilePicture: 'https://foo.com.br/image.png' })
            await user.save()

            user.name = 'bar'
            const updatedUser = await user.save()

            const expected = 'bar'
            const actual = updatedUser.name
            expect(actual).toEqual(expected)
        })
    })
})

describe('user routes tests', () => {
    beforeAll(async () => {
        app = await server.listen(3001)
        await User.deleteMany({})
    })

    afterAll(async done => {
        app.close(done)
    })

    afterEach(async () => {
        await User.deleteMany({})
    })

    describe('user login tests', () => {
        it ('can login', async () => {
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post('/oapi/user/login')
                .send({ email: 'foo@foo.com', password: 'Foo@123!' })
                .expect(200)
        })

        it ('can\'t login - user not registered', async () => {
            await request(server).post('/oapi/user/login')
                .send({ email: 'foo@foo.com', password: 'Foo@123!' })
                .expect(400)
        })

        it ('can\'t login - wrong password', async () => {
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post('/oapi/user/login')
                .send({ email: 'foo@foo.com', password: 'Foo@123' })
                .expect(400)
        })

        it ('can\'t login - wrong email', async () => {
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post('/oapi/user/login')
                .send({ email: 'foo@foo.co', password: 'Foo@123!' })
                .expect(400)
        })

        it ('can\'t login - wrong email and password', async () => {
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post('/oapi/user/login')
                .send({ email: 'foo@foo.co', password: 'Foo@123' })
                .expect(400)
        })
    })

    describe('user signup tests', () => {
        it ('can signup', async () => {
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
        })

        it ('can\'t signup - user already registered - email', async () => {
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo1234', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(400)
        })

        it ('can\'t signup - user already registered - nickname', async () => {
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo123@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(400)
        })

        it ('can\'t signup - invalid email', async () => {
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foofoo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(400)
        })

        it ('can\'t signup - invalid password', async () => {
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'foo', confirm_password: 'Foo@123!' })
                .expect(400)
        })

        it ('can\'t signup - passwords fields don\'t match', async () => {
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123' })
                .expect(400)
        })

        it ('can\'t signup - no nickname', async () => {
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: '', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(400)
        })
    })

    describe('user validateToken tests', () => {
        it ('can validate', async () => {
            let token
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post('/oapi/user/login')
                .send({ email: 'foo@foo.com', password: 'Foo@123!' })
                .expect(200)
                .then(response => {
                    token = response.body.token
                })
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
            let token
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post('/oapi/user/login')
                .send({ email: 'foo@foo.com', password: 'Foo@123!' })
                .expect(200)
                .then(response => {
                    token = response.body.token
                })
            await request(server).get('/api/user/foo123')
                .set('authorization', token)
                .expect(200)
                .then(response => {
                    expect(response.body.userData.email).toEqual('foo@foo.com')
                })
        })

        it ('can\'t getUserByNickname - no nickname', async () => {
            let token
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post('/oapi/user/login')
                .send({ email: 'foo@foo.com', password: 'Foo@123!' })
                .expect(200)
                .then(response => {
                    token = response.body.token
                })
            await request(server).get('/api/user/')
                .set('authorization', token)
                .expect(404)
        })

        it ('can\'t getUserByNickname - no authentication', async () => {
            let token
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post('/oapi/user/login')
                .send({ email: 'foo@foo.com', password: 'Foo@123!' })
                .expect(200)
                .then(response => {
                    token = response.body.token
                })
            await request(server).get('/api/user/foo123')
                .expect(403)
        })

        it ('can\'t getUserByNickname - user not found', async () => {
            let token
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post('/oapi/user/login')
                .send({ email: 'foo@foo.com', password: 'Foo@123!' })
                .expect(200)
                .then(response => {
                    token = response.body.token
                })
            await request(server).get('/api/user/foo1234')
                .set('authorization', token)
                .expect(400)
        })
    })

    describe('user updateUser tests', () => {
        it ('can updateUser', async () => {
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post('/oapi/user/login')
                .send({ email: 'foo@foo.com', password: 'Foo@123!' })
                .expect(200)
                .then(response => {
                    token = response.body.token
                })
            await request(server).put('/api/user/foo123')
                .set('authorization', token)
                .send({ height: 170, weight: 70, preferredFoot: 'Direito', profilePicture: 'https://foo.com.br/image.png' })
                .expect(200)
            await request(server).get('/api/user/foo123')
                .set('authorization', token)
                .expect(200)
                .then(response => {
                    expect(response.body.userData.height).toEqual(170)
                    expect(response.body.userData.weight).toEqual(70)
                    expect(response.body.userData.preferredFoot).toEqual('Direito')
                    expect(response.body.userData.profilePicture).toEqual('https://foo.com.br/image.png')
                })
        })

        it ('can\'t updateUser - user not found', async () => {
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post('/oapi/user/login')
                .send({ email: 'foo@foo.com', password: 'Foo@123!' })
                .expect(200)
                .then(response => {
                    token = response.body.token
                })
            await request(server).put('/api/user/foo1234')
                .set('authorization', token)
                .send({ height: 170, weight: 70, preferredFoot: 'Direito', profilePicture: 'https://foo.com.br/image.png' })
                .expect(400)
        })

        it ('can\'t updateUser - nickname already in use', async () => {
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo1234@foo.com', nickname: 'foo1234', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
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

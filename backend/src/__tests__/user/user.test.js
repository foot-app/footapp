const mongoose = require('mongoose')
const request = require('supertest')
const User = require('../../api/user/user')
const { MongoMemoryServer } = require("mongodb-memory-server");
const server = require('../../loader');
const { response } = require('../../config/server');
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
            const user = new User({ name: 'foo', email: 'foo@foo.com', password: 'Foo@123!' })
            await user.save()

            const foundUser = await User.findOne({ email: 'foo@foo.com'})
            const expected = 'foo'
            const actual = foundUser.name
            expect(actual).toEqual(expected)
        })
    })

    describe('save user', () => {
        it('saves a user', async () => {
            const user = new User({ name: 'foo', email: 'foo@foo.com', password: 'Foo@123!' })
            const savedUser = await user.save()
            const expected = 'foo'
            const actual = savedUser.name
            expect(actual).toEqual(expected)
        })
    })

    describe('update user', () => {
        it('updates a user', async () => {
            const user = new User({ name: 'foo', email: 'foo@foo.com', password: 'Foo@123!' })
            await user.save()

            user.name = 'bar'
            const updatedUser = await user.save()

            const expected = 'bar'
            const actual = updatedUser.name
            expect(actual).toEqual(expected)
        })
    })
})

describe('user routes test', () => {
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
            await request(server).post("/oapi/user/signup")
                .send({ name: 'foo', email: 'foo@foo.com', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post("/oapi/user/login")
                .send({ email: 'foo@foo.com', password: 'Foo@123!' })
                .expect(200)
        })

        it ('can\'t login - user not registered', async () => {
            await request(server).post("/oapi/user/login")
                .send({ email: 'foo@foo.com', password: 'Foo@123!' })
                .expect(400)
        })

        it ('can\'t login - wrong password', async () => {
            await request(server).post("/oapi/user/signup")
                .send({ name: 'foo', email: 'foo@foo.com', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post("/oapi/user/login")
                .send({ email: 'foo@foo.com', password: 'Foo@123' })
                .expect(400)
        })

        it ('can\'t login - wrong email', async () => {
            await request(server).post("/oapi/user/signup")
                .send({ name: 'foo', email: 'foo@foo.com', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post("/oapi/user/login")
                .send({ email: 'foo@foo.co', password: 'Foo@123!' })
                .expect(400)
        })

        it ('can\'t login - wrong email and password', async () => {
            await request(server).post("/oapi/user/signup")
                .send({ name: 'foo', email: 'foo@foo.com', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post("/oapi/user/login")
                .send({ email: 'foo@foo.co', password: 'Foo@123' })
                .expect(400)
        })
    })

    describe('user signup tests', () => {
        it ('can signup', async () => {
            await request(server).post("/oapi/user/signup")
                .send({ name: 'foo', email: 'foo@foo.com', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
        })

        it ('can\'t signup - user already registered', async () => {
            await request(server).post("/oapi/user/signup")
                .send({ name: 'foo', email: 'foo@foo.com', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post("/oapi/user/signup")
                .send({ name: 'foo', email: 'foo@foo.com', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(400)
        })

        it ('can\'t signup - invalid email', async () => {
            await request(server).post("/oapi/user/signup")
                .send({ name: 'foo', email: 'foofoo.com', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(400)
        })

        it ('can\'t signup - invalid password', async () => {
            await request(server).post("/oapi/user/signup")
                .send({ name: 'foo', email: 'foo@foo.com', password: 'foo', confirm_password: 'Foo@123!' })
                .expect(400)
        })

        it ('can\'t signup - passwords fields don\'t match', async () => {
            await request(server).post("/oapi/user/signup")
                .send({ name: 'foo', email: 'foo@foo.com', password: 'Foo@123!', confirm_password: 'Foo@123' })
                .expect(400)
        })
    })

    describe('user validateToken tests', () => {
        it ('can validate', async () => {
            let token
            await request(server).post("/oapi/user/signup")
                .send({ name: 'foo', email: 'foo@foo.com', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post("/oapi/user/login")
                .send({ email: 'foo@foo.com', password: 'Foo@123!' })
                .expect(200)
                .then(response => {
                    token = response.body.token
                })
            await request(server).post("/oapi/user/validateToken")
                .send({ token: token })
                .expect(200)
        })

        it ('can\'t validate - wrong token', async () => {
            await request(server).post("/oapi/user/validateToken")
                .send({ token: 'a' })
                .expect(200, { valid: false })
        })
    })
})

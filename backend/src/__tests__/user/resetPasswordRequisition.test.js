const mongoose = require('mongoose')
const request = require('supertest')
const ResetPasswordRequisition = require('../../api/resetPassword/resetPasswordRequisition')
const { MongoMemoryServer } = require('mongodb-memory-server');
const server = require('../../loader');
const moment = require('moment');
const User = require('../../api/user/user');
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

describe('reset password requisition model test', () => {
    beforeAll(async () => {
        await ResetPasswordRequisition.deleteMany({})
    })

    afterEach(async () => {
        await ResetPasswordRequisition.deleteMany({})
    })

    it('has a module', () => {
        expect(ResetPasswordRequisition).toBeDefined();
    })

    describe('get reset password requisition', () => {
        it('gets a reset password requisition', async () => {
            const token = '5daf9950556a4e9d921a163912e318bbc4083f4c'
            const startDateTs = moment().unix();
            const endDateTs = moment(new Date()).add(1, 'days').unix();

            const resetPasswordRequisition = new ResetPasswordRequisition({ email: 'foo@foo.com', token, startDateTs, endDateTs});
            await resetPasswordRequisition.save();

            const resetRequisitionFound = await ResetPasswordRequisition.findOne({ email: 'foo@foo.com'})
            const expected = 'foo@foo.com'
            const actual = resetRequisitionFound.email
            expect(actual).toEqual(expected)
        })
    })

    describe('save reset password requisition', () => {
        it('saves a reset password requisition', async () => {
            const token = '5daf9950556a4e9d921a163912e318bbc4083f4c'
            const startDateTs = moment().unix();
            const endDateTs = moment(new Date()).add(1, 'days').unix();

            const resetPasswordRequisition = new ResetPasswordRequisition({ email: 'foo@foo.com', token, startDateTs, endDateTs})
            const resetRequisitionSaved = await resetPasswordRequisition.save()
            const expected = 'foo@foo.com'
            const actual = resetRequisitionSaved.email
            expect(actual).toEqual(expected)
        })
    })

    describe('update reset password requisition', () => {
        it('updates a reset password requisition', async () => {
            const token = '5daf9950556a4e9d921a163912e318bbc4083f4c'
            const startDateTs = moment().unix();
            const endDateTs = moment(new Date()).add(1, 'days').unix();
            const resetPasswordRequisition = new ResetPasswordRequisition({ email: 'foo@foo.com', token, startDateTs, endDateTs});
            await resetPasswordRequisition.save()

            resetPasswordRequisition.email = 'bar@bar.com'
            const updatedRequisition = await resetPasswordRequisition.save()

            const expected = 'bar@bar.com'
            const actual = updatedRequisition.email
            expect(actual).toEqual(expected)
        })
    })
})

describe('reset password routes test', () => {
    beforeAll(async () => {
        app = await server.listen(3001)
        await User.deleteMany({})
        await ResetPasswordRequisition.deleteMany({})
    })

    afterAll(async done => {
        app.close(done)
    })

    afterEach(async () => {
        await ResetPasswordRequisition.deleteMany({})
        await User.deleteMany({})
    })

    describe('send reset password e-mail tests', () => {
        it ('can send e-mail', async () => {
            const user = new User({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', height: '170', weight: '70.0', preferredFoot: 'Direito' })
            await user.save()
            await request(server).post('/oapi/resetPassword/sendEmail')
                .send({ email: 'foo@foo.com'})
                .expect(200)
        });

        it ('can\t send e-mail - e-mail não preenchido (string vazia)', async () => {
            await request(server).post('/oapi/resetPassword/sendEmail')
                .send({ email: ''})
                .expect(400)
        });

        it ('can\t send e-mail - e-mail não preenchido (request sem requisition body)', async () => {
            await request(server).post('/oapi/resetPassword/sendEmail')
                .send()
                .expect(400)
        });

        it ('can\t send e-mail - e-mail inválido (sem arroba)', async () => {
            await request(server).post('/oapi/resetPassword/sendEmail')
                .send({ email: 'foofoo.com'})
                .expect(400)
        });

        it ('can\t send e-mail - e-mail inválido (sem ponto)', async () => {
            await request(server).post('/oapi/resetPassword/sendEmail')
                .send({ email: 'foo@foocom'})
                .expect(400)
        });

        it ('can\t send e-mail - e-mail inválido (sem domínio de topo)', async () => {
            await request(server).post('/oapi/resetPassword/sendEmail')
                .send({ email: 'foo@foo.'})
                .expect(400)
        });

        it ('can\t send e-mail - e-mail não encontrado', async () => {
            await request(server).post('/oapi/user/signup')
                .send({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', confirm_password: 'Foo@123!' })
                .expect(200)
            await request(server).post('/oapi/resetPassword/sendEmail')
                .send({ email: 'bar@bar.com'})
                .expect(400)
        });
    })

    describe('change password tests', () => {
        it('can change password', async() => {
            const user = new User({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', height: '170', weight: '70.0', preferredFoot: 'Direito' })
            await user.save()

            const token = '5daf9950556a4e9d921a163912e318bbc4083f4c'
            const startDateTs = moment().unix();
            const endDateTs = moment(new Date()).add(1, 'days').unix();

            const resetPasswordRequisition = new ResetPasswordRequisition({ email: 'foo@foo.com', token, startDateTs, endDateTs});
            await resetPasswordRequisition.save();

            await request(server).post('/oapi/resetPassword/changePassword')
                .send({ token, password: 'Bar@123', confirmationPassword: 'Bar@123', })
                .expect(200)
        });

        it('can change password and signin with new password', async() => {
            const user = new User({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', height: '170', weight: '70.0', preferredFoot: 'Direito' })
            await user.save()

            const token = '5daf9950556a4e9d921a163912e318bbc4083f4c'
            const startDateTs = moment().unix();
            const endDateTs = moment(new Date()).add(1, 'days').unix();

            const resetPasswordRequisition = new ResetPasswordRequisition({ email: 'foo@foo.com', token, startDateTs, endDateTs});
            await resetPasswordRequisition.save();

            await request(server).post('/oapi/resetPassword/changePassword')
                .send({ token, password: 'Bar@123', confirmationPassword: 'Bar@123', })
                .expect(200)

            await request(server).post('/oapi/user/login')
                .send({ email: 'foo@foo.com', password: 'Bar@123' })
                .expect(200)
        });

        it('can\t change password - invalid password', async() => {
            await request(server).post('/oapi/resetPassword/changePassword')
                .send({ token: 'token!123', password: 'a', confirmationPassword: 'a', })
                .expect(400)
        });

        it('can\t change password - password and confirmation password don´t match', async() => {
            await request(server).post('/oapi/resetPassword/changePassword')
                .send({ token: 'token!123', password: 'Foo!123', confirmationPassword: 'Bar!123', })
                .expect(400)
        });

        it('can\t change password - token não encontrado', async() => {
            const token = '5daf9950556a4e9d921a163912e318bbc4083f4c'
            const startDateTs = moment().unix();
            const endDateTs = moment(new Date()).add(1, 'days').unix();

            const resetPasswordRequisition = new ResetPasswordRequisition({ email: 'foo@foo.com', token, startDateTs, endDateTs});
            await resetPasswordRequisition.save();

            await request(server).post('/oapi/resetPassword/changePassword')
                .send({ token: 'token!123', password: 'Foo!123', confirmationPassword: 'Foo!123', })
                .expect(400)
        });

        it('can\t change password - data atual menor que data de começo', async() => {
            const user = new User({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', height: '170', weight: '70.0', preferredFoot: 'Direito' })
            await user.save()

            const token = '5daf9950556a4e9d921a163912e318bbc4083f4c'
            const startDateTs = moment().add(1, 'days').unix();
            const endDateTs = moment(new Date()).add(2, 'days').unix();

            const resetPasswordRequisition = new ResetPasswordRequisition({ email: 'foo@foo.com', token, startDateTs, endDateTs});
            await resetPasswordRequisition.save();

            await request(server).post('/oapi/resetPassword/changePassword')
                .send({ token, password: 'Bar@123', confirmationPassword: 'Bar@123', })
                .expect(400)
        });

        it('can\t change password - data atual maior que data de fim', async() => {
            const user = new User({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', height: '170', weight: '70.0', preferredFoot: 'Direito' })
            await user.save()

            const token = '5daf9950556a4e9d921a163912e318bbc4083f4c'
            const startDateTs = moment().unix();
            const endDateTs = moment(new Date()).subtract(2, 'days').unix();

            const resetPasswordRequisition = new ResetPasswordRequisition({ email: 'foo@foo.com', token, startDateTs, endDateTs});
            await resetPasswordRequisition.save();

            await request(server).post('/oapi/resetPassword/changePassword')
                .send({ token, password: 'Bar@123', confirmationPassword: 'Bar@123', })
                .expect(400)
        });

        it('can\t change password - usuário não encontrado', async() => {
            const user = new User({ name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', height: '170', weight: '70.0', preferredFoot: 'Direito' })
            await user.save()

            const token = '5daf9950556a4e9d921a163912e318bbc4083f4c'
            const startDateTs = moment().unix();
            const endDateTs = moment(new Date()).subtract(2, 'days').unix();

            const resetPasswordRequisition = new ResetPasswordRequisition({ email: 'bar@bar.com', token, startDateTs, endDateTs});
            await resetPasswordRequisition.save();

            await request(server).post('/oapi/resetPassword/changePassword')
                .send({ token, password: 'Bar@123', confirmationPassword: 'Bar@123', })
                .expect(400)
        });
    });
});
const utils = require('../utils')

const request = require('supertest')
const ResetPasswordRequisition = require('../../api/resetPassword/resetPasswordRequisition')
const server = require('../../loader')
const moment = require('moment')
const User = require('../../api/user/user')
let app

const fakeUser = { name: 'foo', email: 'foo@foo.com', nickname: 'foo123', password: 'Foo@123!', height: '170', weight: '70.0', preferredFoot: 'Direito' }

const changePassword = async (statusCode, startAmount, endAmount, email) => {
    const user = new User(fakeUser)
    await user.save()

    const token = '5daf9950556a4e9d921a163912e318bbc4083f4c'
    const startDateTs = endAmount ? moment().add(endAmount, 'days').unix() : moment().unix();
    const endDateTs = moment(new Date()).add(startAmount ? startAmount : 1, 'days').unix();

    const resetPasswordRequisition = new ResetPasswordRequisition({ email: email ? email : fakeUser.email, token, startDateTs, endDateTs});
    await resetPasswordRequisition.save();

    await request(server).post('/oapi/resetPassword/changePassword')
        .send({ token, password: 'Bar@123', confirmationPassword: 'Bar@123' })
        .expect(statusCode ? statusCode : 200)
}

const canNotChangePassword = async (token, password, confirmationPassword) => {
    await request(server).post('/oapi/resetPassword/changePassword')
        .send({ token, password, confirmationPassword })
        .expect(400)
}
 
beforeAll(async () => {
    await utils.connectMongoInMemory()
})

afterAll(async done => {
    await utils.disconnectMongoose(done)
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
        await utils.startServer()
        await utils.resetDB([ResetPasswordRequisition, User])
    })

    afterAll(async done => {
        utils.closeServer(done)
    })

    afterEach(async () => {
        await ResetPasswordRequisition.deleteMany({})
        await User.deleteMany({})
    })

    const sendEmail = async (email, statusCode) => {
        await request(server).post('/oapi/resetPassword/sendEmail')
            .send({ email: email})
            .expect(statusCode)
    }

    describe('send reset password e-mail tests', () => {
        it ('can send e-mail', async () => {
            const user = new User(fakeUser)
            await user.save()
            await request(server).post('/oapi/resetPassword/sendEmail')
                .send({ email: 'foo@foo.com'})
                .expect(200)
        });

        it ('can\t send e-mail - e-mail não preenchido (string vazia)', async () => {
            await sendEmail('', 400)
        });

        it ('can\t send e-mail - e-mail não preenchido (request sem requisition body)', async () => {
            await sendEmail(null, 400)
        });

        it ('can\t send e-mail - e-mail inválido (sem arroba)', async () => {
            await sendEmail('foofoo.com', 400)
        });

        it ('can\t send e-mail - e-mail inválido (sem ponto)', async () => {
            await sendEmail('foo@foocom', 400)
        });

        it ('can\t send e-mail - e-mail inválido (sem domínio de topo)', async () => {
            await sendEmail('foo@foo.', 400)
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
            await changePassword()
        });

        it('can change password and signin with new password', async() => {
            await changePassword()

            await request(server).post('/oapi/user/login')
                .send({ email: 'foo@foo.com', password: 'Bar@123' })
                .expect(200)
        });

        it('can\t change password - invalid password', async() => {
            await canNotChangePassword('token!123', 'a', 'a')
        });

        it('can\t change password - password and confirmation password don´t match', async() => {
            await canNotChangePassword('token!123', 'Foo!123', 'Bar!123')
        });

        it('can\t change password - token não encontrado', async() => {
            const token = '5daf9950556a4e9d921a163912e318bbc4083f4c'
            const startDateTs = moment().unix();
            const endDateTs = moment(new Date()).add(1, 'days').unix();

            const resetPasswordRequisition = new ResetPasswordRequisition({ email: 'foo@foo.com', token, startDateTs, endDateTs});
            await resetPasswordRequisition.save();

            await canNotChangePassword('token!123', 'Foo!123', 'Foo!123')
        });

        it('can\t change password - data atual menor que data de começo', async() => {
            await changePassword(400, 1, 2, 'foo@foo.com')
        });

        it('can\t change password - data atual maior que data de fim', async() => {
            await changePassword(400, null, 2, 'foo@foo.com')
        });

        it('can\t change password - usuário não encontrado', async() => {
            await changePassword(400, null, 2, 'bar@bar.com')
        });
    });
});
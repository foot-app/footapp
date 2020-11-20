describe('Auth component tests', () => {
    beforeEach(async () => {
        await cy.exec('docker exec footapp-backend-test npm run db:reset')
    })

    const userExampleObj = {
        name: 'Foo Foolish',
        email: 'foo@foo.com.br',
        nickname: 'foo123',
        password: 'Foo@123!',
        confirm_password: 'Foo@123!'
    }

    const createUser = async (name, email, nickname, password, confirm_password) => {
        return await cy.request('POST', 'http://localhost:3003/oapi/user/signup', { 
            name: name,
            email: email,
            nickname: nickname,
            password: password,
            confirm_password: confirm_password
        })
    }

    const accessSignupMode = () => {
        cy.visit('/')
        cy.wait(500)
        cy.get('.auth-login-mode').click()
        cy.wait(500)
    }

    const loginAndCheckLogin = email => {
        cy.get('.auth-btn').click().should(() => {
            expect(email ? JSON.parse(localStorage.getItem('_footapp')).email : JSON.parse(localStorage.getItem('_footapp'))).to.eq(email)
        })
    }

    const signupAndLoginFail = (attribute, wrongValue) => {
        accessSignupMode()
        Object.keys(userExampleObj).forEach(property => {
            if (property != attribute)
                cy.get(`[data-test-id="${property}"]`).type(userExampleObj[property]).should('have.value', userExampleObj[property])
            else if (wrongValue)
                cy.get(`[data-test-id="${property}"]`).type(wrongValue).should('have.value', wrongValue)
        })
        loginAndCheckLogin(null)
    }

    const simulateLoginFail = async (email, password) => {
        const request = await createUser(userExampleObj.name, userExampleObj.email, userExampleObj.nickname, userExampleObj.password, userExampleObj.confirm_password)
        expect(response.status).to.eq(200)
        cy.visit('/')
        cy.wait(500)
        cy.get('[data-test-id="email"]').type(email).should('have.value', email)
        cy.get('[data-test-id="password"]').type(password).should('have.value', password)
        loginAndCheckLogin(null)
    }

    it ('renders successfully - login mode', () => {
        cy.visit('/')
        cy.get('[data-test-id="email"]')
        cy.get('[data-test-id="password"]')
        cy.get('.auth-login-mode')
        cy.get('.auth-btn')
    })

    it ('renders successfully - signup mode', () => {
        cy.visit('/')
        cy.get('[data-test-id="email"]')
        cy.get('[data-test-id="password"]')
        cy.get('.auth-login-mode')
        cy.get('.auth-btn')
        cy.get('.auth-login-mode').click()
        cy.get('[data-test-id="name"]')
        cy.get('[data-test-id="email"]')
        cy.get('[data-test-id="password"]')
        cy.get('[data-test-id="confirm_password"]')
    })

    it ('signup successfully', () => {
        cy.visit('/')
        cy.wait(500)
        cy.get('.auth-login-mode').click()
        cy.wait(500)
        cy.get('[data-test-id="name"]').type('Foo Foolish').should('have.value', 'Foo Foolish')
        cy.get('[data-test-id="email"]').type('foo@foo.com.br').should('have.value', 'foo@foo.com.br')
        cy.get('[data-test-id="nickname"]').type('foo123').should('have.value', 'foo123')
        cy.get('[data-test-id="password"]').type('Foo@123!').should('have.value', 'Foo@123!')
        cy.get('[data-test-id="confirm_password"]').type('Foo@123!').should('have.value', 'Foo@123!')
        loginAndCheckLogin('foo@foo.com.br')
    })

    it ('login successfully', async () => {
        const response = await createUser('Foo Foolish', 'foo@foo.com.br', 'foo123', 'Foo@123!', 'Foo@123!')
        expect(response.status).to.eq(200)
        cy.visit('/')
        cy.wait(500)
        cy.get('[data-test-id="email"]').type('foo@foo.com.br').should('have.value', 'foo@foo.com.br')
        cy.get('[data-test-id="password"]').type('Foo@123!').should('have.value', 'Foo@123!')
        loginAndCheckLogin('foo@foo.com.br')
    })

    it ('signup fail - no name', () => {
        signupAndLoginFail('name')
    })

    it ('signup fail - no email', () => {
        signupAndLoginFail('email')
    })

    it ('signup fail - no nickname', () => {
        signupAndLoginFail('nickname')
    })

    it ('signup fail - no password', () => {
        signupAndLoginFail('password')
    })

    it ('signup fail - no confirm_password', () => {
        signupAndLoginFail('confirm_password')
    })

    it ('signup fail - wrong e-mail', () => {
        signupAndLoginFail('email', 'foo')
    })

    it ('signup fail - wrong password', () => {
        signupAndLoginFail('password', 'Foo')
    })

    it ('signup fail - wrong confirm_password', () => {
        signupAndLoginFail('confirm_password', 'Foo@123')
    })

    it ('signup fail - user already registered - email', async () => {
        const response = await createUser('Foo Foolish', 'foo@foo.com.br', 'foo123', 'Foo@123!', 'Foo@123!')
        signupAndLoginFail('')
    })

    it ('signup fail - user already registered - nickname', async () => {
        const response = await createUser('Foo Foolish', 'foo@foo.com.br', 'foo123', 'Foo@123!', 'Foo@123!')
        signupAndLoginFail('')
    })

    it ('login fail - no user registered', () => {
        cy.visit('/')
        cy.wait(500)
        cy.get('[data-test-id="email"]').type('foo@foo.com.br').should('have.value', 'foo@foo.com.br')
        cy.get('[data-test-id="password"]').type('Foo@123!').should('have.value', 'Foo@123!')
        loginAndCheckLogin(null)
    })

    it ('login fail - no email', async () => {
        simulateLoginFail('', 'Foo@123!')
    })

    it ('login fail - no password', async () => {
        simulateLoginFail('foo@foo.com.br', '')
    })

    it ('login fail - wrong email', async () => {
        simulateLoginFail('foo@foo', 'Foo@123!')
    })

    it ('login fail - wrong password', async () => {
        simulateLoginFail('foo@foo.com.br', 'Foo@123')
    })
})
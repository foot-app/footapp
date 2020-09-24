describe('Auth component tests', () => {
    beforeEach(async () => {
        await cy.exec('docker exec footapp-backend-test npm run db:reset')
    })

    it('renders successfully - login mode', () => {
        cy.visit('/')
        cy.get('[data-test-id="email"]')
        cy.get('[data-test-id="password"]')
        cy.get('.auth-login-mode')
        cy.get('.auth-btn')
    })

    it('renders successfully - signup mode', () => {
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

    it('signup successfully', () => {
        cy.visit('/')
        cy.get('.auth-login-mode').click()
        cy.get('[data-test-id="name"]').type('Foo Foolish')
        cy.get('[data-test-id="email"]').type('foo@foo.com.br')
        cy.get('[data-test-id="password"]').type('Foo@123!')
        cy.get('[data-test-id="confirm_password"]').type('Foo@123!')
        cy.get('.auth-btn').click().should(() => {
            expect(JSON.parse(localStorage.getItem('_footapp')).email).to.eq('foo@foo.com.br')
        })
    })

    it('login successfully', () => {
        cy.request('POST', 'http://localhost:3003/oapi/user/signup', { 
            name: 'Foo Foolish',
            email: 'foo@foo.com.br', 
            password: 'Foo@123!',
            confirm_password: 'Foo@123!'
        }).then((response) => {
            expect(response.status).to.eq(200)
            cy.visit('/')
            cy.get('[data-test-id="email"]').type('foo@foo.com.br')
            cy.get('[data-test-id="password"]').type('Foo@123!')
            cy.get('.auth-btn').click().should(() => {
                expect(JSON.parse(localStorage.getItem('_footapp')).email).to.eq('foo@foo.com.br')
            })
        })
    })

    it('signup fail - no name', () => {
        cy.visit('/')
        cy.get('.auth-login-mode').click()
        cy.get('[data-test-id="email"]').type('foo@foo.com.br')
        cy.get('[data-test-id="password"]').type('Foo@123!')
        cy.get('[data-test-id="confirm_password"]').type('Foo@123!')
        cy.get('.auth-btn').click().should(() => {
            expect(localStorage.getItem('_footapp')).to.eq(null)
        })
    })

    it('signup fail - no email', () => {
        cy.visit('/')
        cy.get('.auth-login-mode').click()
        cy.get('[data-test-id="name"]').type('Foo Foolish')
        cy.get('[data-test-id="password"]').type('Foo@123!')
        cy.get('[data-test-id="confirm_password"]').type('Foo@123!')
        cy.get('.auth-btn').click().should(() => {
            expect(localStorage.getItem('_footapp')).to.eq(null)
        })
    })

    it('signup fail - no password', () => {
        cy.visit('/')
        cy.get('.auth-login-mode').click()
        cy.get('[data-test-id="name"]').type('Foo Foolish')
        cy.get('[data-test-id="email"]').type('foo@foo.com.br')
        cy.get('[data-test-id="confirm_password"]').type('Foo@123!')
        cy.get('.auth-btn').click().should(() => {
            expect(localStorage.getItem('_footapp')).to.eq(null)
        })
    })

    it('signup fail - no confirm_password', () => {
        cy.visit('/')
        cy.get('.auth-login-mode').click()
        cy.get('[data-test-id="name"]').type('Foo Foolish')
        cy.get('[data-test-id="email"]').type('foo@foo.com.br')
        cy.get('[data-test-id="password"]').type('Foo@123!')
        cy.get('.auth-btn').click().should(() => {
            expect(localStorage.getItem('_footapp')).to.eq(null)
        })
    })

    it('signup fail - wrong e-mail', () => {
        cy.visit('/')
        cy.get('.auth-login-mode').click()
        cy.get('[data-test-id="name"]').type('Foo Foolish')
        cy.get('[data-test-id="email"]').type('foo')
        cy.get('[data-test-id="password"]').type('Foo@123!')
        cy.get('[data-test-id="confirm_password"]').type('Foo@123!')
        cy.get('.auth-btn').click().should(() => {
            expect(localStorage.getItem('_footapp')).to.eq(null)
        })
    })

    it('signup fail - wrong password', () => {
        cy.visit('/')
        cy.get('.auth-login-mode').click()
        cy.get('[data-test-id="name"]').type('Foo Foolish')
        cy.get('[data-test-id="email"]').type('foo@foo.com.br')
        cy.get('[data-test-id="password"]').type('Foo')
        cy.get('[data-test-id="confirm_password"]').type('Foo')
        cy.get('.auth-btn').click().should(() => {
            expect(localStorage.getItem('_footapp')).to.eq(null)
        })
    })

    it('signup fail - wrong confirm_password', () => {
        cy.visit('/')
        cy.get('.auth-login-mode').click()
        cy.get('[data-test-id="name"]').type('Foo Foolish')
        cy.get('[data-test-id="email"]').type('foo@foo.com.br')
        cy.get('[data-test-id="password"]').type('Foo@123!')
        cy.get('[data-test-id="confirm_password"]').type('Foo@123')
        cy.get('.auth-btn').click().should(() => {
            expect(localStorage.getItem('_footapp')).to.eq(null)
        })
    })

    it('signup fail - user already registered', () => {
        cy.request('POST', 'http://localhost:3003/oapi/user/signup', { 
            name: 'Foo Foolish',
            email: 'foo@foo.com.br', 
            password: 'Foo@123!',
            confirm_password: 'Foo@123!'
        }).then((response) => {
            expect(response.status).to.eq(200)
            cy.visit('/')
            cy.get('.auth-login-mode').click()
            cy.get('[data-test-id="name"]').type('Foo Foolish')
            cy.get('[data-test-id="email"]').type('foo@foo.com.br')
            cy.get('[data-test-id="password"]').type('Foo@123!')
            cy.get('[data-test-id="confirm_password"]').type('Foo@123!')
            cy.get('.auth-btn').click().should(() => {
                expect(localStorage.getItem('_footapp')).to.eq(null)
            })
        })
    })

    it('login fail - no user registered', () => {
        cy.visit('/')
        cy.get('[data-test-id="email"]').type('foo@foo.com.br')
        cy.get('[data-test-id="password"]').type('Foo@123!')
        cy.get('.auth-btn').click().should(() => {
            expect(localStorage.getItem('_footapp')).to.eq(null)
        })
    })

    it('login fail - no email', () => {
        cy.request('POST', 'http://localhost:3003/oapi/user/signup', { 
            name: 'Foo Foolish',
            email: 'foo@foo.com.br', 
            password: 'Foo@123!',
            confirm_password: 'Foo@123!'
        }).then((response) => {
            expect(response.status).to.eq(200)
            cy.visit('/')
            cy.get('[data-test-id="password"]').type('Foo@123!')
            cy.get('.auth-btn').click().should(() => {
                expect(localStorage.getItem('_footapp')).to.eq(null)
            })
        })      
    })

    it('login fail - no password', () => {
        cy.request('POST', 'http://localhost:3003/oapi/user/signup', { 
            name: 'Foo Foolish',
            email: 'foo@foo.com.br', 
            password: 'Foo@123!',
            confirm_password: 'Foo@123!'
        }).then((response) => {
            expect(response.status).to.eq(200)
            cy.visit('/')
            cy.get('[data-test-id="email"]').type('foo@foo.com.br')
            cy.get('.auth-btn').click().should(() => {
                expect(localStorage.getItem('_footapp')).to.eq(null)
            })
        })      
    })

    it('login fail - wrong email', () => {
        cy.request('POST', 'http://localhost:3003/oapi/user/signup', { 
            name: 'Foo Foolish',
            email: 'foo@foo.com.br', 
            password: 'Foo@123!',
            confirm_password: 'Foo@123!'
        }).then((response) => {
            expect(response.status).to.eq(200)
            cy.visit('/')
            cy.get('[data-test-id="email"]').type('foo@foo')
            cy.get('[data-test-id="password"]').type('Foo@123!')
            cy.get('.auth-btn').click().should(() => {
                expect(localStorage.getItem('_footapp')).to.eq(null)
            })
        })
    })

    it('login fail - wrong password', () => {
        cy.request('POST', 'http://localhost:3003/oapi/user/signup', { 
            name: 'Foo Foolish',
            email: 'foo@foo.com.br', 
            password: 'Foo@123!',
            confirm_password: 'Foo@123!'
        }).then((response) => {
            expect(response.status).to.eq(200)
            cy.visit('/')
            cy.get('[data-test-id="email"]').type('foo@foo.com.br')
            cy.get('[data-test-id="password"]').type('Foo@123')
            cy.get('.auth-btn').click().should(() => {
                expect(localStorage.getItem('_footapp')).to.eq(null)
            })
        })
    })
})
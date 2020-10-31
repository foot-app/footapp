describe('MatchCreate components tests', () => {
    beforeEach(async () => {
        await cy.exec('docker exec footapp-backend-test npm run db:reset')
        createUserAndLogin()
    })

    const createUserAndLogin = () => {
        cy.request('POST', 'http://localhost:3003/oapi/user/signup', { 
            name: 'Foo Foolish',
            email: 'foo@foo.com.br',
            nickname: 'foo123',
            password: 'Foo@123!',
            confirm_password: 'Foo@123!'
        }).then((response) => {
            expect(response.status).to.eq(200)
            cy.visit('/')
            cy.wait(500)
            cy.get('[data-test-id="email"]').type('foo@foo.com.br').should('have.value', 'foo@foo.com.br')
            cy.get('[data-test-id="password"]').type('Foo@123!').should('have.value', 'Foo@123!')
            cy.get('.auth-btn').click().should(() => {
                expect(JSON.parse(localStorage.getItem('_footapp')).email).to.eq('foo@foo.com.br')
            })
        })
    }

    const fillCreateMatchFormCorrectly = () => {
        cy.get('[data-test-id="name"]').clear().type('Partida Teste').should('have.value', 'Partida Teste')
        cy.get('[data-test-id="rentAmount"]').clear().type('500').should('have.value', '500')
        cy.get('[data-test-id="matchType"]').select('futsal').should('have.value', 'futsal')
        cy.get('[data-test-id="creatorHasBall"]').select('false').should('have.value', 'false')
        cy.get('[data-test-id="creatorHasVest"]').select('true').should('have.value', 'true')
        cy.get('[data-test-id="goalkeeperPays"]').select('true').should('have.value', 'true')
        cy.get('[data-test-id="street"]').clear().type('Alameda A').should('have.value', 'Alameda A')
        cy.get('[data-test-id="number"]').clear().type('200').should('have.value', '200')
        cy.get('[data-test-id="neighborhood"]').clear().type('Bairro B').should('have.value', 'Bairro B')
        cy.get('[data-test-id="city"]').clear().type('Cidade C').should('have.value', 'Cidade C')
        cy.get('[data-test-id="state"]').clear().type('Estado D').should('have.value', 'Estado D')
        cy.get('[data-test-id="date"]').clear().type('11112020').should('have.value', '11/11/2020')
        cy.get('[data-test-id="schedule"]').clear().type('1330').should('have.value', '13:30')
        
    }

    it('renders successfully', () => {
        cy.visit('/#/match/create')
        cy.wait(500)
        cy.get('[data-test-id="name"]').should('exist')
        cy.get('[data-test-id="rentAmount"]').should('exist')
        cy.get('[data-test-id="matchType"]').should('exist')
        cy.get('[data-test-id="creatorHasBall"]').should('exist')
        cy.get('[data-test-id="creatorHasVest"]').should('exist')
        cy.get('[data-test-id="goalkeeperPays"]').should('exist')
        cy.get('[data-test-id="street"]').should('exist')
        cy.get('[data-test-id="number"]').should('exist')
        cy.get('[data-test-id="neighborhood"]').should('exist')
        cy.get('[data-test-id="city"]').should('exist')
        cy.get('[data-test-id="state"]').should('exist')
        cy.get('[data-test-id="date"]').should('exist')
        cy.get('[data-test-id="schedule"]').should('exist')
        cy.get('[data-test-id="submit-button"]').should('exist')
        cy.get('[data-test-id="cancel-button"]').should('exist')
    })

    it('create match successfully', () => {
        cy.visit('/#/match/create')
        cy.wait(500)
        fillCreateMatchFormCorrectly();
        cy.get('[data-test-id="submit-button"]').click()
        cy.wait(500)
        cy.url().should('eq', 'http://localhost:8081/#/matches')
        cy.get('[data-test-id="createMatchButton"]').should('exist')
    })

    it('can\'t create match successfully - name not included', () => {
        cy.visit('/#/match/create')
        cy.wait(500)
        fillCreateMatchFormCorrectly();
        cy.get('[data-test-id="name"]').clear()
        cy.get('[data-test-id="submit-button"]').click()
        cy.wait(500)
        cy.url().should('eq', 'http://localhost:8081/#/match/create')
    })

    it('can\'t create match successfully - street not included', () => {
        cy.visit('/#/match/create')
        cy.wait(500)
        fillCreateMatchFormCorrectly();
        cy.get('[data-test-id="street"]').clear()
        cy.get('[data-test-id="submit-button"]').click()
        cy.wait(500)
        cy.url().should('eq', 'http://localhost:8081/#/match/create')
    })

    it('can\'t create match successfully - number not included', () => {
        cy.visit('/#/match/create')
        cy.wait(500)
        fillCreateMatchFormCorrectly();
        cy.get('[data-test-id="number"]').clear()
        cy.get('[data-test-id="submit-button"]').click()
        cy.wait(500)
        cy.url().should('eq', 'http://localhost:8081/#/match/create')
    })

    it('can\'t create match successfully - neighborhood not included', () => {
        cy.visit('/#/match/create')
        cy.wait(500)
        fillCreateMatchFormCorrectly();
        cy.get('[data-test-id="neighborhood"]').clear()
        cy.get('[data-test-id="submit-button"]').click()
        cy.wait(500)
        cy.url().should('eq', 'http://localhost:8081/#/match/create')
    })

    it('can\'t create match successfully - city not included', () => {
        cy.visit('/#/match/create')
        cy.wait(500)
        fillCreateMatchFormCorrectly();
        cy.get('[data-test-id="city"]').clear()
        cy.get('[data-test-id="submit-button"]').click()
        cy.wait(500)
        cy.url().should('eq', 'http://localhost:8081/#/match/create')
    })

    it('can\'t create match successfully - state not included', () => {
        cy.visit('/#/match/create')
        cy.wait(500)
        fillCreateMatchFormCorrectly();
        cy.get('[data-test-id="state"]').clear()
        cy.get('[data-test-id="submit-button"]').click()
        cy.wait(500)
        cy.url().should('eq', 'http://localhost:8081/#/match/create')
    })

    it('can\'t create match successfully - date not included', () => {
        cy.visit('/#/match/create')
        cy.wait(500)
        fillCreateMatchFormCorrectly();
        cy.get('[data-test-id="date"]').clear()
        cy.get('[data-test-id="submit-button"]').click()
        cy.wait(500)
        cy.url().should('eq', 'http://localhost:8081/#/match/create')
    })

    it('can\'t create match successfully - schedule not included', () => {
        cy.visit('/#/match/create')
        cy.wait(500)
        fillCreateMatchFormCorrectly();
        cy.get('[data-test-id="schedule"]').clear()
        cy.get('[data-test-id="submit-button"]').click()
        cy.wait(500)
        cy.url().should('eq', 'http://localhost:8081/#/match/create')
    })
})
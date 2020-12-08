import 'cypress-file-upload'

describe('ProfileEdit components tests', () => {
    beforeEach(async () => {
        await cy.exec('docker exec footapp-backend-test npm run db:reset')
        accessSocialPage()
    })

    const accessSocialPage = () => {
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
                cy.visit('/#/social')
                cy.get('[data-test-id=userSearch]')
                cy.get('[data-test-id=info-img]')
                cy.get('[data-test-id=info-name]')
                cy.get('[data-test-id=info-nickname]')
                cy.get('[data-test-id=info-positions]')
                cy.get('[data-test-id=sendSolicitation-button]')
            })
        })
    }

    const createBarUser = () => {
        cy.request('POST', 'http://localhost:3003/oapi/user/signup', { 
            name: 'Bar Bearer',
            email: 'bar@bar.com.br',
            nickname: 'bar123',
            password: 'Bar@123!',
            confirm_password: 'Bar@123!',
        }).then(response => {
            expect(response.status).to.eq(200)
            cy.request({
                method: 'PUT', 
                url: 'http://localhost:3003/api/user/bar123', 
                body: { fut7Positions: ['gk', 'zc'], futsalPositions: ['fx', 'pv'] },
                headers: {
                    authorization: response.body.token
                }
            }).then(response => {
                expect(response.status).to.eq(200)
            })
        })
    }

    it ('renders successfully', () => {
        cy.get('[data-test-id=userSearch]').should('have.value', '')
        cy.get('[data-test-id=info-img]').should('have.attr', 'src').should('equal', '')
        cy.get('[data-test-id=info-name]').should('have.text', '')
        cy.get('[data-test-id=info-nickname]').should('have.text', '')
        cy.get('[data-test-id=info-positions]').should('have.text', 'Fut7:  | Futsal: ')
        cy.get('[data-test-id=sendSolicitation-button]')
    })

    describe('search bar tests', () => {
        it ('search for user successfully', () => {
            createBarUser()
            cy.get('[data-test-id=userSearch]').type('Bar Bearer')
            cy.get('[data-test-id=userSearch-list]').find('li').should('have.text', 'Bar Bearer')
        })

        it ('search for user not registered', () => {
            cy.get('[data-test-id=userSearch]').type('Bar Bearer')
            cy.get('[data-test-id=userSearch-list]').find('li').should('have.length', 0)
        })

        it ('search for yourself', () => {
            cy.get('[data-test-id=userSearch]').type('Foo Foolish')
            cy.get('[data-test-id=userSearch-list]').find('li').should('have.length', 0)
        })

        it ('search for user and show info', () => {
            createBarUser()
            cy.get('[data-test-id=userSearch]').type('Bar Bearer')
            cy.get('[data-test-id=userSearch-list]').find('li').should('have.text', 'Bar Bearer')
            cy.get('[data-test-id=userSearch-list]').find('li').click()
            cy.wait(500)
            cy.get('[data-test-id=info-img]').should('have.attr', 'src').should('contain', 'firebase')
            cy.get('[data-test-id=info-name]').should('have.text', 'Bar Bearer')
            cy.get('[data-test-id=info-nickname]').should('have.text', 'bar123')
            cy.get('[data-test-id=info-positions]').should('have.text', 'Fut7: GK-ZC | Futsal: FX-PV')
        })
    })
})
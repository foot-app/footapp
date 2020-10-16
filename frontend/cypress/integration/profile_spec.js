describe('Profile components tests', () => {
    beforeEach(async () => {
        await cy.exec('docker exec footapp-backend-test npm run db:reset')
    })

    it ('renders successfully - profile', () => {
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
                cy.visit('/#/profile')
                cy.wait(500)
                cy.get('[data-test-id="name"]')
                cy.get('[data-test-id="nickname"]')
                cy.get('[data-test-id="physical-data"]')
            })
        })
    })
})
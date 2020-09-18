describe('Auth component tests', () => {
    it('renders successfully - login mode', () => {
        cy.visit('/')
        cy.get('[data-test-id="email"]').type('leogiraldimg@gmail.com')
        cy.get('[data-test-id="password"]').type('Lgmg6521!')
        cy.get('.auth-login-mode')
        cy.get('.auth-btn').click()
        cy.get('h1')
    })

    it('renders successfully - signupmode', () => {
        
    })
})
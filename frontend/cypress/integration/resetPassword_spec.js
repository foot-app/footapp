describe('Reset password components tests', () => {
    beforeEach(async () => {
        await cy.exec('docker exec footapp-backend-test npm run db:reset')
        signupUser()
    });

    const signupUser = () => {
        cy.request('POST', 'http://localhost:3003/oapi/user/signup', { 
            name: 'Foo Foolish',
            email: 'foo@foo.com.br',
            nickname: 'foo123',
            password: 'Foo@123!',
            confirm_password: 'Foo@123!'
        }).then((response) => {
            expect(response.status).to.eq(200)
        })
    };

    it ('renders successfully - reset password requisition', async() => {
        cy.visit('/');
        cy.get('.reset-password-link').click()
        cy.get('[data-test-id="reset_password_title"]')
        cy.get('[data-test-id="email_input"]')
        cy.get('[data-test-id="confirm_btn"]')
    });
    
    it ('send e-mail successfully', async() => {
        cy.visit('/');
        cy.get('.reset-password-link').click();
        cy.get('[data-test-id="reset_password_title"]')
        cy.get('[data-test-id="email_input"]').type('foo@foo.com.br').should('have.value', 'foo@foo.com.br')
        cy.get('[data-test-id="confirm_btn"]').click()
        cy.wait(6000);
        cy.get('[data-test-id="email"]')
        cy.get('[data-test-id="password"]')
        cy.get('.auth-login-mode')
        cy.get('.auth-btn')
    });

    it ('send e-mail fail - usuário não encontrado', async() => {
        cy.visit('/');
        cy.get('.reset-password-link').click();
        cy.get('[data-test-id="reset_password_title"]')
        cy.get('[data-test-id="email_input"]').type('foo@foo.com.br').should('have.value', 'foo@foo')
        cy.get('[data-test-id="confirm_btn"]').click()
        cy.wait(6000);
        cy.get('[data-test-id="email_input"]').type('foo@foo.com.br').should('have.value', 'foo@foo')
    });
});
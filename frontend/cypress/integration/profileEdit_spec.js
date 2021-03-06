import 'cypress-file-upload'

describe('ProfileEdit components tests', () => {
    beforeEach(async () => {
        await cy.exec('docker exec footapp-backend-test npm run db:reset')
        accessProfileEditPage()
    })

    const accessProfileEditPage = () => {
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
                cy.visit('/#/profile/edit')
                cy.wait(500)
                cy.get('[data-test-id="name"]').should('have.value', 'Foo Foolish')
                cy.get('[data-test-id="nickname"]').should('have.value', 'foo123')
                cy.get('[data-test-id="height"]').should('have.value', '')
                cy.get('[data-test-id="weight"]').should('have.value', '')
                cy.get('[data-test-id="preferredFoot"]').should('have.value', 'Direito')
                cy.get('[data-test-id="submit-button"]')
                cy.get('[data-test-id="cancel-button"]')
            })
        })
    }

    const fillProfileUpdateFormCorrectly = () => {
        cy.get('[data-test-id="name"]').clear().type('Foo Foolish Foo').should('have.value', 'Foo Foolish Foo')
        cy.get('[data-test-id="nickname"]').clear().type('foo1234').should('have.value', 'foo1234')
        cy.get('[data-test-id="height"]').type('170').should('have.value', '170')
        cy.get('[data-test-id="weight"]').type('75.0').should('have.value', '75.0')
        cy.get('[data-test-id="preferredFoot"]').select('Esquerdo').should('have.value', 'Esquerdo')
        cy.get('input[name="fut7-positions-gk"]').check()
        cy.get('[data-test-id="matchType"]').select('futsal')
        cy.get('input[name="futsal-positions-gk"]').check()
        cy.get('input[name="futsal-positions-fx"]').check()
        attachProfilePictureAux()
        cy.wait(1000)
        cy.get('[data-test-id="profilePicture"]').should('include.value', 'https://firebasestorage.googleapis.com/v0/b/footapp-frontend.appspot.com/o/images')
    }

    const attachProfilePictureAux = (imgFormat) => {
        cy.fixture('test.' + (imgFormat ? imgFormat : 'jpg'), 'base64')
            .then(Cypress.Blob.base64StringToBlob)
            .then(fileContent => {
                cy.get('[data-test-id="profilePictureAux"]').attachFile({
                    fileContent: fileContent,
                    fileName: imgFormat ? 'test.' + imgFormat : 'test.jpg',
                    mimeType: imgFormat ? 'image/' + imgFormat : 'image/jpg'
                })
            })
    }

    it ('renders successfully - profileEdit', () => {
        fillProfileUpdateFormCorrectly()
    })

    it ('update successfully', () => {
        fillProfileUpdateFormCorrectly()
        cy.get('[data-test-id="submit-button"]').click()
        cy.wait(1000)
        cy.get('[data-test-id="name"]').contains('Foo Foolish Foo')
        cy.get('[data-test-id="nickname"]').contains('foo1234')
        cy.get('[data-test-id="physical-data"]').contains('170')
        cy.get('[data-test-id="physical-data"]').contains('75')
        cy.get('[data-test-id="physical-data"]').contains('Esquerdo')
        cy.get('[data-test-id="profilePicture"]').should('have.attr', 'src').should('include', 'https://firebasestorage.googleapis.com/v0/b/footapp-frontend.appspot.com/o/images')
        cy.get('[data-test-id="edit-button"]').click()
        cy.wait(1000)
        cy.get('input[name="futsal-positions-gk"]').should('be.checked')
        cy.get('input[name="futsal-positions-fx"]').should('be.checked')
    })

    it ('update fail - no name', () => {
        fillProfileUpdateFormCorrectly()
        cy.get('[data-test-id="name"]').clear()
        cy.get('[data-test-id="submit-button"]').click()
        cy.wait(1000)
        cy.url().should('eq', 'http://localhost:8081/#/profile/edit')
    })

    it ('update fail - no nickname', () => {
        fillProfileUpdateFormCorrectly()
        cy.get('[data-test-id="nickname"]').clear()
        cy.get('[data-test-id="submit-button"]').click()
        cy.wait(1000)
        cy.url().should('eq', 'http://localhost:8081/#/profile/edit')
    })

    it ('update successfully - no height', () => {
        fillProfileUpdateFormCorrectly()
        cy.get('[data-test-id="height"]').clear()
        cy.get('[data-test-id="submit-button"]').click()
        cy.wait(1000)
        cy.get('[data-test-id="name"]').contains('Foo Foolish Foo')
        cy.get('[data-test-id="nickname"]').contains('foo1234')
        cy.get('[data-test-id="physical-data"]').contains('-')
        cy.get('[data-test-id="physical-data"]').contains('75')
        cy.get('[data-test-id="physical-data"]').contains('Esquerdo')
    })

    it ('update successfully - no weight', () => {
        fillProfileUpdateFormCorrectly()
        cy.get('[data-test-id="weight"]').clear()
        cy.get('[data-test-id="submit-button"]').click()
        cy.wait(1000)
        cy.get('[data-test-id="name"]').contains('Foo Foolish Foo')
        cy.get('[data-test-id="nickname"]').contains('foo1234')
        cy.get('[data-test-id="physical-data"]').contains('170')
        cy.get('[data-test-id="physical-data"]').contains('-')
        cy.get('[data-test-id="physical-data"]').contains('Esquerdo')
    })

    it ('update successfully - no position', () => {
        fillProfileUpdateFormCorrectly()
        cy.get('input[name="futsal-positions-gk"]').uncheck()
        cy.get('input[name="futsal-positions-fx"]').uncheck()
        cy.get('[data-test-id="submit-button"]').click()
        cy.wait(1000)
        cy.get('[data-test-id="name"]').contains('Foo Foolish Foo')
        cy.get('[data-test-id="nickname"]').contains('foo1234')
        cy.get('[data-test-id="physical-data"]').contains('170')
        cy.get('[data-test-id="physical-data"]').contains('75')
        cy.get('[data-test-id="physical-data"]').contains('Esquerdo')
        cy.get('[data-test-id="edit-button"]').click()
        cy.wait(1000)
        cy.get('input[name="futsal-positions-gk"]').should('not.be.checked')
        cy.get('input[name="futsal-positions-fx"]').should('not.be.checked')
    })

    it ('cancel update', () => {
        cy.get('[data-test-id="cancel-button"]').click()
        cy.url().should('eq', 'http://localhost:8081/#/profile')      
    })

    it ('update fail - nickname already in use', () => {
        cy.request('POST', 'http://localhost:3003/oapi/user/signup', { 
            name: 'Foo Foolish',
            email: 'foo1234@foo.com.br',
            nickname: 'foo1234',
            password: 'Foo@123!',
            confirm_password: 'Foo@123!'
        }).then((response) => {
            expect(response.status).to.eq(200)
            fillProfileUpdateFormCorrectly()
            cy.get('[data-test-id="submit-button"]').click()
            cy.url().should('eq', 'http://localhost:8081/#/profile/edit')
        })
    })

    it ('wrong image format - profilePicture', () => {
        attachProfilePictureAux('pdf')
        cy.wait(1000)
        cy.get('[data-test-id="profilePicture"]').should('have.value', '')
    })

    it ('remove image inserted - profilePicture', () => {
        fillProfileUpdateFormCorrectly()
        attachProfilePictureAux()
        cy.wait(1000)
        cy.get('[data-test-id="profilePicture"]').should('include.value', 'https://firebasestorage.googleapis.com/v0/b/footapp-frontend.appspot.com/o/images')
        cy.get('[data-test-id="profilePictureAux_delete"]').click()
        cy.get('[data-test-id="profilePicture"]').should('have.value', '')
    })
})
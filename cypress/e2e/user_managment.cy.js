/**
 * Testing for user managment as admin user
 * @author Michal Senderák (xsendem00)
 */

describe('User Management as Admin', () => {
    const testUser = {
        firstName: 'Ondrej',
        lastName: 'Jablko',
        email: 'jablko@mail.com',
        phone: '123456'
    }

    const createUser = (user) => {
        cy.get('#add-customer').click()
        cy.get('#first-name').type(user.firstName)
        cy.get('#last-name').type(user.lastName)
        cy.get('#email').type(user.email)
        cy.get('#phone-number').type(user.phone)
        cy.get('#timezone').select('UTC')
        cy.get('#save-customer').click()
        cy.contains('Customer saved successfully.').should('be.visible')
    }

    const deleteUser = (fullName) => {
        cy.contains(fullName).click()
        cy.get('#delete-customer').click()
        cy.get('.btn-primary').contains('Delete').click()
        cy.contains('Customer deleted successfully.').should('be.visible')
    }


    beforeEach(() => {
        cy.on('uncaught:exception', (err) => {
            // Return false to prevent Cypress from failing the test
            if (err.message.includes('Cannot read properties of null')) return false
        })
        cy.visit('/')
        cy.get('.backend-link[href$="/login"]').click()
        cy.get('#username').type('admin')
        cy.get('#password').type('admin123')
        cy.get('#login').click()
        cy.get('[href$="/customers"]').should('be.visible').click()
    })

    //------
    //TEST 1
    it('Add new customer', () => {
        createUser(testUser)

        cy.contains(`${testUser.firstName} ${testUser.lastName}`).should('be.visible')
        cy.contains(testUser.email).should('be.visible')

        deleteUser(`${testUser.firstName} ${testUser.lastName}`)
    })

    //-------
    // TEST 2
    it('Delete customer', () => {
        const userDelete = {
            ...testUser,
            email: 'delete.user@mail.com'
        }
        createUser(userDelete)
        deleteUser(`${userDelete.firstName} ${userDelete.lastName}`)
        cy.contains(userDelete.email).should('not.exist')
    })

    //-------
    // TEST 3

    it('Update customer details', () => {
        const userToUpdate = {
            ...testUser,
            email: 'update.user@mail.com'
        }

        createUser(userToUpdate)

        //----
        cy.contains(`${userToUpdate.firstName} ${userToUpdate.lastName}`).click()
        cy.get('#edit-customer').click()
        cy.get('#phone-number').clear().type('456456456')
        cy.get('#save-customer').click()

        cy.contains('Customer saved successfully.').should('exist')

        deleteUser(`${userToUpdate.firstName} ${userToUpdate.lastName}`)
    })


    //------
    // TEST 4
    it('Update customer details with invalid email address and with invalid phone-number',() => {
        const invalidUser = {
            ...testUser,
            email: 'invalid.user@mail.com'
        }
        createUser(invalidUser)
        //----
        cy.contains(`${invalidUser.firstName} ${invalidUser.lastName}`).click()
        cy.get('#edit-customer').click()

        cy.get('#email').clear().type('invalid.mail.com')
        cy.get('#save-customer').click()

        cy.contains('Invalid email address.').should('be.visible')
        cy.get('#email').should('have.class', 'is-invalid')
        //----
        cy.get('#email').clear().type('invalid.user@mail.com')
        cy.get('#save-customer').click()
        //-----
        cy.contains(`${invalidUser.firstName} ${invalidUser.lastName}`).click()
        cy.get('#edit-customer').click()
        cy.get('#phone-number').clear().type('qwerty')
        cy.get('#save-customer').click()

        cy.contains('Invalid phone number.').should('be.visible')
        cy.get('#phone-number').should('have.class', 'is-invalid')

        cy.get('#cancel-customer').click()

        deleteUser(`${invalidUser.firstName} ${invalidUser.lastName}`)
    })

    //-----
    // TEST 5
    it('Edit customer\'s booking', () => {
        const bookingUser = {
            ...testUser,
            firstName: 'bookingUser',
            email: 'booking.user@mail.com'
        }

        createUser(bookingUser)

        cy.get('[href$="/calendar"]').click()
        cy.get('.fc-timegrid-slot-lane')
            .not('.fc-timegrid-slot-minor')
            .eq(10).click({force: true})

        cy.get('.btn-primary').contains('Appointment').click()
        cy.get('#select-customer').click()
        cy.contains(`${bookingUser.firstName} ${bookingUser.lastName}`).click()
        cy.get('#save-appointment').click()

        cy.contains('Appointment saved successfully').should('be.visible')

        //--
        cy.get('[href$="/customers"]').click()
        cy.contains(`${bookingUser.firstName} ${bookingUser.lastName}`).click()
        cy.get('.appointment-row')
            .first()
            .contains('Room 42 - Jane Doe')
            .click()
        cy.get('#start-datetime').clear().type('30/04/2025 11:00 pm')
        cy.get('#save-appointment').click()

        cy.contains('Appointment saved successfully.').should('be.visible')
        cy.get('#calendar').should('contain', `Room 42 - ${bookingUser.firstName} ${bookingUser.lastName}`)

        // delete
        cy.get('#calendar').contains(`Room 42 - ${bookingUser.firstName} ${bookingUser.lastName}`).click()
        cy.get('.delete-popover').click()
        cy.get('.btn-primary').contains('Delete').click()

        cy.get('[href$="/customers"]').click()
        deleteUser(`${bookingUser.firstName} ${bookingUser.lastName}`)
    })

    //-----
    // TEST 6

    it('Search by name, mail', () => {
        const searchUser = {
            ...testUser,
            firstName: 'NewName',
            email: `search.user@mail.com`
        }

        createUser(searchUser)

        cy.get('.input-group').first().type(searchUser.firstName)
        cy.get('[type="submit"').click()
        cy.get('#filter-customers').should('contain', searchUser.firstName)

        cy.get('.input-group').first().clear().type(searchUser.email)
        cy.get('[type="submit"').click()
        cy.get('#filter-customers').should('contain', searchUser.email)

        deleteUser(`${searchUser.firstName} ${searchUser.lastName}`)
    })
})

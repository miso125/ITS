/**
 * Testing of reservation managment as admin user
 * @author Michal Senderák (xsendem00)
 */

describe('Reservation management', () => {
    const uniqueId = Date.now()

    const selectFirstAvailableDate = () => {
        cy.get('span.flatpickr-day:not(.flatpickr-disabled):not(.prevMonthDay)').first().click()
    }

    const deleteUser = (fullName) => {
        cy.get('[href$="/customers"]').click()
        cy.contains(fullName).click()
        cy.get('#delete-customer').click()
        cy.get('.btn-primary').contains('Delete').click()
        cy.contains('Customer deleted successfully.').should('be.visible')
    }

    const createAppointment = (user) => {

        cy.get('#calendar-actions button.btn-light[data-bs-toggle="dropdown"]:visible').click()
        cy.get('#insert-appointment').click()

        cy.get('#start-datetime').clear().type('01/05/2025 11:00 am')
        cy.get('#first-name').type(user.firstName)
        cy.get('#last-name').type(user.lastName)
        cy.get('#email').type(user.email)
        cy.get('#phone-number').type(user.phone)
        cy.get('#save-appointment').click()

        cy.contains('Appointment saved successfully').should('be.visible')
    }

    const loginAsAdmin = () => {
        cy.visit('/')
        cy.get('.backend-link').click()
        cy.get('#username').type('admin')
        cy.get('#password').type('admin123')
        cy.get('#login').click()
    }

    const logout = () => {
        cy.get('a.nav-link.dropdown-toggle').contains('John Smith').click()
        cy.contains('Log Out').click()
    }

    beforeEach(() => {
        loginAsAdmin()
    })

    //------
    // TEST 1
    it('Deleting an appointment', () => {
        logout()
        cy.visit('/')

        selectFirstAvailableDate()
        cy.get('#select-timezone').select('UTC')

        let bookedTime

        cy.get('#available-hours button:visible')
            .should('have.length.gt', 0)
            .then($buttons => {
                bookedTime = $buttons[0].innerText
                cy.wrap(bookedTime).as('bookingTime')
                $buttons[0].click()
        })

        cy.get('#button-next-2').click()
        cy.get('#first-name').type('Fero')
        cy.get('#last-name').type('Mrkva')
        cy.get('#email').type(`mrkva${uniqueId}@mail.com`)
        cy.get('#phone-number').type('0456456')
        cy.get('#button-next-3').click()
        cy.get('#book-appointment-submit').click()
        cy.get('#success-icon').should('be.visible')
        cy.get('[href$="/index.php"]').click()

        //-----

        loginAsAdmin()

        //----
        cy.get('@bookingTime').then(timeText => {
            const timeRegex = new RegExp(`^${timeText.replace(/\s/g, '\\s')}\\s`, 'i')
            cy.get('.fc-event-time').contains(timeRegex).closest('.fc-event').as('appointmentToDelete')

            cy.get('@appointmentToDelete').click()
            cy.get('.delete-popover').click()
            cy.get('button.btn-primary').contains('Delete').click()
            cy.get('.fc-timegrid-col-events').should('not.contain', timeText)
        })

        deleteUser('Fero Mrkva')
    })

    //--------
    // TEST 2
    it('Editing an appointment', () => {
        const user = {
            firstName: 'Edit',
            lastName: 'Test',
            email: `edit${uniqueId}@mail.com`,
            phone: '123123123'
        }

        createAppointment(user)

        cy.get('.fc-event-main').first().as('appointmentToEdit')
        cy.get('@appointmentToEdit').click()
        cy.get('.edit-popover').click()
        cy.get(
            '.color-selection-option[style*="background-color: rgb(243, 188, 125)"]')
            .click()
        cy.get('#save-appointment').click()
        cy.get('@appointmentToEdit')
            .closest('.fc-event')
            .should('have.css', 'border-color', 'rgb(243, 188, 125)')
        cy.contains('Appointment saved successfully.').should('be.visible')

        deleteUser(`${user.firstName} ${user.lastName}`)
    })

    //--------
    // Test 3: Add new appointment
    it('Add new appointment', () => {
        const user = {
            firstName: 'Mato',
            lastName: 'Beno',
            email: `beno${uniqueId}@mail.com`,
            phone: '4588744'
        }
        createAppointment(user)

        cy.get('#calendar').should('contain', `${user.firstName} ${user.lastName}`)

        deleteUser(`${user.firstName} ${user.lastName}`)
    })

    //------
    // Test 4: Add new appointment without mandatory details
    it('Add new appointment without mandatory details', () => {
        cy.get('.fc-timegrid-slot-lane')
            .not('.fc-timegrid-slot-minor')
            .eq(10)  // Select a reasonable time slot 
            .click({force: true})

        cy.get('.btn-primary').contains('Appointment').click()
        cy.get('#first-name').type('Mato')
        cy.get('#last-name').type('beno')
        cy.get('#email').type('beno.invalid.com')
        cy.get('#phone-number').type('4588744')
        cy.get('#save-appointment').click()

        cy.get('#email').should('have.class', 'is-invalid')
        cy.contains('Invalid email address.').should('exist')
        cy.get('.modal-content').should('be.visible')

        cy.get('button[data-bs-dismiss="modal"').contains('Cancel').click()
    })
})
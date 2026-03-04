/**
 * Testing for unregistered user booking
 * @author Michal Senderák (xsendem00)
 */

describe('Unregistered User Booking', () => {
    let selectedTime = ''

    const selectFirstAvailableDate = () => {
        cy.get('span.flatpickr-day:not(.flatpickr-disabled):not(.prevMonthDay)').first().click()
    }

    const selectRandomTime = () => {
        cy.get('#available-hours button:visible').then($buttons => {
            const randomIndex = Math.floor(Math.random() * $buttons.length)
            cy.wrap($buttons[randomIndex]).as('selectedTime')
                .invoke('text')
                .then(text => {
                    selectedTime = text.trim()
                })
            cy.wrap($buttons[randomIndex].click())
        })
    }

    beforeEach(() => {
        cy.visit('/')
    })

    //---------------
    // TEST 1

    it('Successful booking', () => {
        selectFirstAvailableDate()
        cy.get('#select-timezone').select('UTC')
        selectRandomTime()

        cy.get('#button-next-2').click()
        cy.get('#first-name').type('Fero')
        cy.get('#last-name').type('Mrkva')
        cy.get('#email').type('mrkva@mail.com')
        cy.get('#phone-number').type('0456456')
        cy.get('#button-next-3').click()
        cy.get('#book-appointment-submit').click()
        cy.get('#success-icon').should('be.visible')
    })

    // -----------------------------
    // TEST 2

    it('Reservation with invalid email', () => {
        
        selectFirstAvailableDate()
        cy.get('#select-timezone').select('UTC')
        selectRandomTime()

        cy.get('#button-next-2').click()
        cy.get('#first-name').type('Fero')
        cy.get('#last-name').type('Mrkva')
        cy.get('#email').type('invalid-email')
        cy.get('#phone-number').type('0456456')
        cy.get('#button-next-3').click()

        cy.get('#email').should('have.class', 'is-invalid')
        cy.get('#wizard-frame-3').should('be.visible')
    })

    // -----------------------------
    // TEST 3

    it('Reservation with invalid telephone number', () => {
        // cy.get('#select-service').select('Room 42')
        // cy.get('#select-provider').select('Jane Doe')
        // cy.get('#button-next-1').click()
        selectFirstAvailableDate()
        cy.get('#select-timezone').select('UTC')
        selectRandomTime()

        cy.get('#button-next-2').click()
        cy.get('#first-name').type('Fero')
        cy.get('#last-name').type('Mrkva')
        cy.get('#email').type('mrkva@mail.com')
        cy.get('#phone-number').type('0456456abc')
        cy.get('#button-next-3').click()

        cy.get('#phone-number').should('have.class', 'is-invalid')
        cy.get('#wizard-frame-3').should('be.visible')
    })

    // -----------------------------
    // TEST 4

    it('Booking with missing required fields', () => {
        // cy.get('#select-service').select('Room 42')
        // cy.get('#select-provider').select('Jane Doe')
        // cy.get('#button-next-1').click()
        selectFirstAvailableDate()
        cy.get('#select-timezone').select('UTC')
        selectRandomTime()

        cy.get('#button-next-2').click()
        cy.get('#last-name').type('Mrkva')
        cy.get('#email').type('mrkva@mail.con')
        cy.get('#phone-number').type('0456456')
        cy.get('#button-next-3').click()

        cy.get('#first-name').should('have.class', 'is-invalid')
        cy.get('#wizard-frame-3').should('be.visible')
    })

    // -----------------------------
    // TEST 5
    it('Prevent duplicate bookings', () => {
        // cy.get('#select-service').select('Room 42')
        // cy.get('#select-provider').select('Jane Doe')
        // cy.get('#button-next-1').click()

        let timeToBook = ''

        selectFirstAvailableDate()
        cy.get('#select-timezone').select('UTC')

        cy.get('#available-hours button:visible').first().as('timeButton')
        cy.get('@timeButton').invoke('text').then(text => {
            timeToBook = text.trim()
        })
        cy.get('@timeButton').click()

        cy.get('#button-next-2').click()
        cy.get('#first-name').type('Fero')
        cy.get('#last-name').type('Mrkva')
        cy.get('#email').type('mrkva@mail.com')
        cy.get('#phone-number').type('0456456')
        cy.get('#button-next-3').click()
        cy.get('#book-appointment-submit').click()

        cy.get('.btn-primary').click()
        // second try

        // cy.get('#select-service').select('Room 42')
        // cy.get('#select-provider').select('Jane Doe')
        // cy.get('#button-next-1').click()
        selectFirstAvailableDate()
        cy.get('#select-timezone').select('UTC')

        cy.get('#available-hours button:visible').each($el => {
            cy.wrap($el).invoke('text').then(text => {
                if (text.trim() === timeToBook) {
                    cy.wrap($el).should('not.exist')
                }
            })
        })

        cy.get('#wizard-frame-2').should('be.visible')
    })
})
/**
 * Testing of view change on calendar page
 * @author Michal Senderák (xsendem00)
 */

describe('View Management as Admin', () => {
  beforeEach(() => {
    cy.visit('/')
  cy.get('.backend-link').click()
  cy.get('#username').type('admin')
  cy.get('#password').type('admin123')
  cy.get('#login').click()
    cy.get('[href="http://localhost:8080/index.php/calendar"]').click()
  });

    // TEST 1
    it('Month view', () => {
      cy.get('[title="Month view"]').click();
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;  // JS months are 0-indexed
      const monthStr = month < 10 ? `0${month}` : `${month}`;
      const daysInMonth = new Date(year, month, 0).getDate();

      cy.get(`td.fc-day[data-date^="${year}-${monthStr}-"]`)
          .should('have.length', daysInMonth)
    });

    // TEST2
    it('Week view', () => {
      cy.get('[title="Week view"]').click();


      cy.get('td.fc-timegrid-col[data-date^="2025-"').should('have.length', 7)
    });

    // TEST 3
    it('Day view', () => {
      cy.get('[title="Day view"]').click();

      const now = new Date();
      cy.get('#fc-dom-1').should('contain', now.getDate())

      cy.get('a.fc-col-header-cell-cushion').should('have.length', 1)
    });
});

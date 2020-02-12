// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
  cy.findByPlaceholderText(/Your email.../i)
    .type('test@test.com')
    .findByPlaceholderText(/Your password.../i)
    .type('test123')
    .findAllByText(/Sign in/i)
    .first()
    .click();
});

Cypress.Commands.add('pickDate', () => {
  cy.get('.ant-calendar-picker-input')
    .click({ force: true })
    .get('.ant-calendar-date-panel')
    .within(() =>
      cy
        .findByText(/jan/i)
        .click()
        .findByText(/nov/i)
        .click()
        .findAllByText(/10/i)
        .first()
        .click()
    );
});

Cypress.Commands.add('goToProfilePage', () => {
  cy.findByTestId('settings')
    .click()
    .findByTestId('goToProfilePage')
    .click()
    .url()
    .should('include', 'profile');
});

// Cypress.Commands.add('drag', (testId, x, y) => {
//   cy.findByTestId(testId)
//     .trigger('mousedown', { button: 0, clientX: x, clientY: y })
//     .trigger('mousemove', { button: 0, clientX: x * 2, clientY: y * 2 })
//     .wait(2000)
//     .trigger('mouseup', { force: true });
// });

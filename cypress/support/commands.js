
const registerUser = (email) => {
    cy.intercept('POST', 'register').as('register');
    cy.visit('/#/register');
    cy.get('[data-cy="email-field"]').type(email);
    cy.get('[data-cy="password-1-field"]').type('pAssw0rd', {log: false});
    cy.get('[data-cy="password-2-field"]').type('pAssw0rd', {log: false});
    cy.get('[data-cy="register-button"]').click();
    cy.wait('@register')
}

// const loginUser = (email) => {
//     cy.intercept('POST', 'log_in').as('logIn');
//
//     // Log into the app.
//     cy.visit('/#/log-in');
//     cy.get('input#username').type(email);
//     cy.get('input#password').type('pAssw0rd', {log: false});
//     cy.get('button').contains('Log in').click();
//     cy.wait('@logIn');
// };

Cypress.Commands.add('registerUser', registerUser);
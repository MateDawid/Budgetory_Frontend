
/**
 * Creates new User in API.
 * @param {string} email - User email.
 */
const registerUser = (email) => {
    cy.request(
        'POST',
        `${Cypress.config('backendUrl')}/api/users/register/`,
        {'email': email, 'password_1': 'pAssw0rd', 'password_2': 'pAssw0rd'}
    ).as('register');
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
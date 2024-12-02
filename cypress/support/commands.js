
const dummy_password = 'pAssw0rd'

/**
 * Creates new User in API.
 * @param {string} email - User email.
 */
const registerUser = (email) => {
    cy.request(
        'POST',
        `${Cypress.config('backendUrl')}/api/users/register/`,
        {'email': email, 'password_1': dummy_password, 'password_2': dummy_password}
    ).as('register');
}

/**
 * Logs User in.
 * @param {string} email - User email.
 * @param {string} password - User password.
 */
const loginUser = (email, password= dummy_password) => {
    cy.intercept('POST', 'login').as('login');
    cy.visit('/#/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password, {log: false});
    cy.get('button').contains('Log in').click();
    cy.wait('@login');
};

Cypress.Commands.add('registerUser', registerUser);
Cypress.Commands.add('loginUser', loginUser);
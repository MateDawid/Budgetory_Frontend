const { faker } = require('@faker-js/faker');

describe('User registration process', () => {
  it('Register successful', () => {
    const email = faker.internet.email();
    cy.intercept('POST', 'register').as('register');
    cy.visit('/#/register');
    cy.get('[data-cy="email-field"]').type(email);
    cy.get('[data-cy="password-1-field"]').type('pAssw0rd', {log: false});
    cy.get('[data-cy="password-2-field"]').type('pAssw0rd', {log: false});
    cy.get('[data-cy="register-button"]').click();
    cy.wait('@register')
    cy.hash().should('eq', '#/login');
  })
    it('Go to login', () => {
    const email = faker.internet.email();
    cy.intercept('POST', 'register').as('register');
    cy.visit('/#/register');
    cy.get('[data-cy="login-button"]').click();
    cy.hash().should('eq', '#/login');
  })
  it('Register failed - user exists already', () => {
    const email = faker.internet.email();
    cy.registerUser(email);
    cy.intercept('POST', 'register').as('register');
    cy.visit('/#/register');
    cy.get('[data-cy="email-field"]').type(email);
    cy.get('[data-cy="password-1-field"]').type('pAssw0rd', {log: false});
    cy.get('[data-cy="password-2-field"]').type('pAssw0rd', {log: false});
    cy.get('[data-cy="register-button"]').click();
    cy.wait('@register');
    cy.get('[data-cy="errors-display"]').contains('user with this email already exists.')
  })
  it('Register failed - email not provided', () => {
    cy.intercept('POST', 'register').as('register');
    cy.visit('/#/register');
    cy.get('[data-cy="password-1-field"]').type('pAssw0rd', {log: false});
    cy.get('[data-cy="password-2-field"]').type('pAssw0rd', {log: false});
    cy.get('[data-cy="register-button"]').click();
    cy.get('[id=":r1:-helper-text"]').contains('Email is required')
  })
  it('Register failed - email invalid', () => {
    cy.intercept('POST', 'register').as('register');
    cy.visit('/#/register');
    cy.get('[data-cy="email-field"]').type("not_valid_email");
    cy.get('[data-cy="password-1-field"]').type('pAssw0rd', {log: false});
    cy.get('[data-cy="password-2-field"]').type('pAssw0rd', {log: false});
    cy.get('[data-cy="register-button"]').click();
    cy.get('[id=":r1:-helper-text"]').contains('Invalid email address')
  })
  it('Register failed - password 1 not provided', () => {
    const email = faker.internet.email();
    cy.registerUser(email);
    cy.intercept('POST', 'register').as('register');
    cy.visit('/#/register');
    cy.get('[data-cy="email-field"]').type(email);
    cy.get('[data-cy="password-2-field"]').type('pAssw0rd', {log: false});
    cy.get('[data-cy="register-button"]').click();
    cy.get('[id=":r3:-helper-text"]').contains('Password is required')
  })
  it('Register failed - password 1 too short', () => {
    const email = faker.internet.email();
    cy.registerUser(email);
    cy.intercept('POST', 'register').as('register');
    cy.visit('/#/register');
    cy.get('[data-cy="email-field"]').type(email);
    cy.get('[data-cy="password-1-field"]').type('pAssw', {log: false});
    cy.get('[data-cy="password-2-field"]').type('pAssw0rd', {log: false});
    cy.get('[data-cy="register-button"]').click();
    cy.get('[id=":r3:-helper-text"]').contains('Password must be at least 8 characters')
  })
    it('Register failed - password 2 not provided', () => {
    const email = faker.internet.email();
    cy.registerUser(email);
    cy.intercept('POST', 'register').as('register');
    cy.visit('/#/register');
    cy.get('[data-cy="email-field"]').type(email);
    cy.get('[data-cy="password-1-field"]').type('pAssw0rd', {log: false});
    cy.get('[data-cy="register-button"]').click();
    cy.get('[id=":r5:-helper-text"]').contains('Password is required')
  })
  it('Register failed - password 2 too short', () => {
    const email = faker.internet.email();
    cy.registerUser(email);
    cy.intercept('POST', 'register').as('register');
    cy.visit('/#/register');
    cy.get('[data-cy="email-field"]').type(email);
    cy.get('[data-cy="password-1-field"]').type('pAssw0rd', {log: false});
    cy.get('[data-cy="password-2-field"]').type('pAss', {log: false});
    cy.get('[data-cy="register-button"]').click();
    cy.get('[id=":r5:-helper-text"]').contains('Password must be at least 8 characters')
  })
})


const { faker } = require('@faker-js/faker');

describe('User login process', () => {
  it('Login successful', () => {
    const email = faker.internet.email();
    cy.registerUser(email);
    cy.loginUser(email);
    cy.hash().should('eq', '#/');
  })
    it('Go to register', () => {
    const email = faker.internet.email();
    cy.visit('/#/login');
    cy.get('a').contains('Register').click();
    cy.hash().should('eq', '#/register');
  })
  it('Login failed - email not provided', () => {
    cy.visit('/#/login');
    cy.get('input[name="password"]').type('pAssw0rd', {log: false});
    cy.get('button').contains('Log in').click();
    cy.get('[id=":r1:-helper-text"]').contains('Email is required')
  })
  it('Login failed - password not provided', () => {
    const email = faker.internet.email();
    cy.visit('/#/login');
    cy.get('input[name="email"]').type(email, {log: false});
    cy.get('button').contains('Log in').click();
    cy.get('[id=":r3:-helper-text"]').contains('Password is required')
  })
  it('Login failed - not existing user', () => {
    const email = faker.internet.email();
    cy.visit('/#/login');
    cy.get('input[name="email"]').type(email, {log: false});
    cy.get('input[name="password"]').type('wR0ngP4ss', {log: false});
    cy.get('button').contains('Log in').click();
    cy.get('[data-cy="errors-display"]').contains('No active account found with the given credentials')
  })
    it('Login failed - wrong password for existing user', () => {
    const email = faker.internet.email();
    cy.registerUser(email, 's0meP4ss');
    cy.visit('/#/login');
    cy.get('input[name="email"]').type(email, {log: false});
    cy.get('input[name="password"]').type('wR0ngP4ss', {log: false});
    cy.get('button').contains('Log in').click();
    cy.get('[data-cy="errors-display"]').contains('No active account found with the given credentials')
  })
})


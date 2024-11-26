describe('User login', () => {
  it('Redirect to login if not logged in', () => {
    cy.visit('/#/');
    cy.hash().should('eq', '#/login');
  })
})
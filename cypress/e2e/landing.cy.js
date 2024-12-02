describe('Landing page', () => {
  it('Redirect to login page if user not logged in', () => {
    cy.visit('/#/');
    cy.hash().should('eq', '#/login');
  })
})


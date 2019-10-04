describe('services', () => {
  it('lets you add a service', () => {
    cy.visit('/')
      .login()
      .findByText(/Welcome!/i)
      .findByText(/services/i)
      .click()
      .findByText(/profile/i);
  });

  it.skip('lets you update a service', () => {
    cy.visit('/')
      .login()
      .findByText(/Welcome!/i)
      .findByText(/services/i)
      .click()
      .findByText(/profile/i);
  });

  it.skip('lets you delete a service', () => {
    cy.visit('/')
      .login()
      .findByText(/Welcome!/i)
      .findByText(/services/i)
      .click()
      .findByText(/profile/i);
  });
});

describe('services', () => {
  it('lets you add a service', () => {
    cy.visit('/')
      .login()
      .findByText(/Welcome/i)
      .findByText(/services/i)
      .click()
      .findByTestId(/services/i)
      .queryByTestId(/serviceBox/i)
      .should('not.exist')
      .findByText(/add a service/i)
      .click()
      .queryByTestId(/serviceBox/i)
      .should('exist')
      .findByPlaceholderText(/What should people ask for/i)
      .type('example title')
      .findByPlaceholderText(/What do people get/i)
      .type('example service')
      .findByPlaceholderText(/How much/i)
      .type(53)
      .findByPlaceholderText(/How do I find out more/i)
      .type('example link')
      .findByText(/example title/i)
      .findByText(/Go To Your Public Referral Page/i)
      .click()
      .url()
      .should('include', 'refer')
      .findByText(/example title/i)
      .findByText(/sign out/i)
      .click();
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

  it.skip('lets me add testimonials', () => {
    cy.visit('/')
      .login()
      .findByText(/Welcome!/i)
      .findByText(/services/i)
      .click()
      .findByText(/profile/i);
  });
});

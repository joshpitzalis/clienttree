describe('authentication', () => {
  it('lets you sign in and logout', () => {
    cy.visit('/')
      .login()
      .findByText(/Welcome!/i)
      .findByText(/sign out/i)
      .click()
      .findByPlaceholderText(/Your email.../i);
  });
});

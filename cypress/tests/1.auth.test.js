describe('authentication', () => {
  it('lets you sign in and logout', () => {
    cy.visit('/')
      .login()
      .wait(5000)
      .findByTestId('outreachPage')
      .findByTestId('settings')
      .click()
      .findByText(/Logout/i)
      .click()
      .findByPlaceholderText(/Your email.../i);
  });
});

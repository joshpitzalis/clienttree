describe('authentication', () => {
  it('lets you sign in and logout', () => {
    cy.visit('/')
      .login()
      .findByTestId('salesDashboard')
      .findByTestId('settings')
      .click()
      .findByText(/Logout/i)
      .click()
      .findByPlaceholderText(/Your email.../i);
  });
});

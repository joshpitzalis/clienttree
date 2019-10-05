describe('onboarding', () => {
  it('lets you create an email signature', () => {
    cy.visit('/')
      .login()
      .findByText(/Welcome!/i)
      .findByText(
        /Create a referrable email signature by completing your profile/i
      )
      .click()
      .findAllByText(/profile/i)
      .findByTestId('signatureCard')
      .contains(
        /Do you know any of my ideal clients that need help with the thing I help with/i
      )
      .findByPlaceholderText(/Your name.../i)
      .type('Chonk McTonk')
      .findByPlaceholderText(/professional pickle peeler/i)
      .type('Pickle')
      .findByPlaceholderText(/www.something.com/i)
      .type('lalalalal')
      .findByPlaceholderText(/my ideal clients/i)
      .type('bears')
      .findByPlaceholderText(/the thing i help with/i)
      .type('traps')
      .findByTestId('signatureCard')
      .contains(/Chonk McTonk/i)
      .contains(/Pickle/i)
      .contains(/please refer me/i)
      .contains(/Do you know any bears that need help with traps/i)
      .url()
      .should('include', 'profile')
      .findByText(/save/i)
      .click()
      .url()
      .should('include', 'dashboard')
      .findByText(/Welcome!/i)
      .wait(10000)
      .findByText(/nice!/i)
      .findByText(/sign out/i)
      .click();
  });
});

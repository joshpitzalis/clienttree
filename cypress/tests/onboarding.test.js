describe('onboarding', () => {
  it('lets you create an email signature', () => {
    cy.visit('/')
      .login()
      .findByText(/Welcome!/i)
      .findByText(/Ask for a referral in your email signature/i)
      .click()
      // .findByText(
      //   /Do you know any of my ideal clients that need help with the thing I help with/i
      // )
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
      // .findByText(/Do you know any bears that need help with traps/i)
      .url()
      .should('include', 'profile')
      .findByText(/save/i)
      .click()
      .url()
      .should('include', 'dashboard')
      .findByText(/Welcome!/i)
      .wait(10000)
      .findByText(/nice!/i);
  });
});

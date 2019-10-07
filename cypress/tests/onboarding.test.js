describe('onboarding', () => {
  it('lets you create an email signature', () => {
    const fakeData = {
      name: 'Rick',
      designation: 'Pickle',
      clients: 'bears',
      problem: 'traps',
      website: 'abc.com',
    };

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
      .wait(3000)
      .findByPlaceholderText(/Your name.../i)
      .type(fakeData.name)
      .findByPlaceholderText(/professional pickle peeler/i)
      .type(fakeData.designation)
      .findByPlaceholderText(/www.something.com/i)
      .type(fakeData.website)
      .findByPlaceholderText(/my ideal clients/i)
      .type(fakeData.clients)
      .findByPlaceholderText(/the thing i help with/i)
      .type(fakeData.problem)
      .findByTestId('signatureCard')
      .contains(fakeData.name)
      .findByTestId('signatureCard')
      .contains(fakeData.designation)
      .findByTestId('signatureCard')
      .contains(/please refer me/i)
      .findByTestId('signatureCard')
      .contains(/Do you know any bears that need help with traps/i)
      .wait(3000)
      .findByText(/save/i)
      .click()
      .url()
      .should('include', 'dashboard')
      .findByText(/Welcome!/i)
      .wait(10000)
      .findByText(/nice!/i)

      .findByText(/services/i)
      .click()
      .url()
      .should('include', 'profile')
      .findByText(/Go To Your Public Referral Page/i)
      .click()
      .url()
      .should('include', 'refer')
      .findByText(fakeData.name)
      .findByText(fakeData.designation)
      .findByText('I specialise in helping bears with traps .')
      .findByText(/sign out/i)
      .click();
  });

  it.skip('hook up onboarding steps to email and services', () => {});
});

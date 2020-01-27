describe('onboarding', () => {
  it('shows first task completed when you start', () => {
    cy.visit('/')
      .login()
      .wait(5000)
      .findByTestId('outreachPage')
      .findByLabelText(/Sign up to Client Tree/i)
      .should('be.checked');
  });

  it('lets you create an email signature', () => {
    const fakeData = {
      name: 'Rick',
      designation: 'Pickle',
      clients: 'bears',
      problem: 'traps',
      website: 'abc.com',
    };

    cy.visit('/')
      .findByTestId('outreachPage')
      .findByTestId('signature')
      .should('not.be.checked')
      .findByText(
        /Complete your profile to create a referrable email signature/i
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
      .findByLabelText(
        /Completed your profile and created a referrable email signature/i
      )
      .should('be.checked')
      .goToProfilePage()
      .findByText(/Go To Your Public Referral Page/i)
      .click()
      .url()
      .should('include', 'refer')
      .findByText(fakeData.name)
      .findByText(fakeData.designation)
      .findByText('I specialise in helping bears with traps .');
  });

  it('once you have create a signature the onboarding task is marked complete and this change is persisted', () => {
    cy.visit('/')
      .findByTestId('outreachPage')
      .findByLabelText(
        /Completed your profile and created a referrable email signature/i
      )
      .should('be.checked');
  });

  it('you cannot uncheck signature step once persisted', () => {
    cy.visit('/')
      .findByTestId('outreachPage')
      .findByLabelText(
        /Completed your profile and created a referrable email signature/i
      )
      .should('be.checked')
      .findByLabelText(
        /Completed your profile and created a referrable email signature/i
      )
      .uncheck({ force: true })
      .findByLabelText(
        /Completed your profile and created a referrable email signature/i
      )
      .should('be.checked');
  });

  context.skip('hook up onboarding steps to email and services', () => {
    it.skip('lets me mark send email complete', () => {});
    it.skip('modal pops  up after signature explaining you can send to josh', () => {});
    it.skip('let people mark sending email complete', () => {});
    it.skip('complete referrla page once servicea  are  added', () => {});
    it.skip('complete crm task when one client is added to network', () => {});
    it.skip('add a helpful task to a client', () => {});
    it.skip('mark a helpful task complete', () => {});
    it.skip('set up financials', () => {});
  });
});

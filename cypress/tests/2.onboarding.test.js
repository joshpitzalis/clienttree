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

  context('can complete onboarding', () => {
    it('lets me mark send email complete', () => {
      cy.visit('/')
        .findByTestId('outreachPage')
        .findByTestId('email')
        .should('not.be.checked')
        .findByTestId('email')
        .check()
        .wait(5000)
        .findByTestId('email')
        .should('be.checked');
    });

    it('lets me mark outreach complete', () => {
      cy.visit('/')
        .findByTestId('outreachPage')
        .findByTestId('reachOut')
        .should('not.be.checked')
        .findByTestId('reachOut')
        .check()
        .wait(5000)
        .findByTestId('reachOut')
        .should('be.checked');
    });

    // 'hides onboarding box when complete' test is in people.test
  });
});

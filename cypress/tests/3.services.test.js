describe('services', () => {
  const fakeData = {
    title: 'example title',
    title2: 'fake title',
    service: 'example service',
    price: 'Cost $500 and takes 5 weeks to deliver',
    link: 'xyz.com',
    newPrice: 'Cost $600 and takes 6 weeks to deliver',
  };

  it('lets you add a service', () => {
    cy.visit('/')
      .findByText(/Welcome/i)
      .findByTestId('linkToServices')
      .click()
      .findByTestId('services')
      .wait(5000)
      .queryByTestId('serviceBox')
      .should('not.exist')
      .findByTestId('addService')
      .click()
      .findByPlaceholderText(/What should people ask for/i)
      .type(fakeData.title)
      .findByPlaceholderText(/What do people get/i)
      .type(fakeData.service)
      .findByPlaceholderText(/How much/i)
      .type(fakeData.price)
      .findByPlaceholderText(/How do I find out more/i)
      .type(fakeData.link)
      .wait(5000)
      .findByText(/Go To Your Public Referral Page/i)
      .click()
      .url()
      .should('include', 'refer')
      .findByText(fakeData.title)
      .findByText(fakeData.service)
      .findByText(fakeData.price);
  });

  it('lets you update a service', () => {
    cy.visit('/')
      .findByText(/Welcome!/i)
      .findByTestId('linkToServices')
      .click()
      .findByTestId('services')
      .click()
      .findByText(fakeData.price)
      .clear()
      .type(fakeData.newPrice)
      .wait(2000)
      .findByText(/Go To Your Public Referral Page/i)
      .click()
      .url()
      .should('include', 'refer')
      .findByText(fakeData.newPrice);
  });

  it('lets you delete a service', () => {
    cy.visit('/')
      .findByText(/Welcome!/i)
      .findByTestId('linkToServices')
      .click()
      .findByTestId('services')
      .click()
      .wait(5000)
      .findByTestId('addService')
      .click()
      .findAllByPlaceholderText(/What should people ask for/i)
      .last()
      .type(fakeData.title2)
      .wait(2000)
      .findByText(/DELETE EXAMPLE TITLE/i)
      .click()
      .findByText(/DELETE EXAMPLE TITLE/i)
      .click()
      .wait(2000)
      .findByText(/Go To Your Public Referral Page/i)
      .click()
      .url()
      .should('include', 'refer')
      .findByText(fakeData.title2)
      .queryByText(fakeData.title)
      .should('not.exist');
  });

  // it.skip('lets me add testimonials', () => {
  //   cy.visit('/')
  //     .login()
  //     .findByText(/Welcome!/i)
  //     .findByText(/services/i)
  //     .click()
  //     .findByText(/profile/i);
  // });
});

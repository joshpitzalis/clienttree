describe('outreach', () => {
  const fakeData = {
    name: 'Sick Rick',
    lastContacted: 'about a week ago',
    description: 'Pickle',
    updatedName: 'Skeletor',
  };

  it('lets you add a contact', () => {
    cy.visit('/')
      .findByText(/Welcome/i)
      .findByText(/outreach/i)
      .click()
      .findByTestId(/outreachPage/i)
      .findByText(/Add someone to your network/i)
      .click()
      .findByTestId(/contactModal/i)
      .findByPlaceholderText(/Your name/i)
      .type(fakeData.name)
      .findByPlaceholderText(/last contacted/i)
      .type(fakeData.lastContacted)
      .findByPlaceholderText(/notes/i)
      .type(fakeData.description)
      .findByText(/save/i)
      .click()
      .wait(5000)
      .queryByTestId(/contactModal/i)
      .should('not.exist')
      .findByText(fakeData.name);
  });

  it.only('lets you update a contact', () => {
    cy.visit('/')
      .findByText(/Welcome/i)
      .findByText(/outreach/i)
      .click()
      .findByTestId(/outreachPage/i)
      .findByText(fakeData.name)
      .click()
      .findByTestId(/contactModal/i)
      .get('#name')
      .click()
      .clear()
      .type(fakeData.updatedName)
      .findByText(/save/i)
      .click()
      .wait(5000)
      .queryByTestId(/contactModal/i)
      .should('not.exist')
      .findByText(fakeData.updatedName);
  });

  it('lets you delete a contact', () => {
    cy.visit('/').login();
  });

  it('creates a task', () => {
    cy.visit('/').login();
  });

  it('updates a task', () => {
    cy.visit('/').login();
  });

  it('completes a task', () => {
    cy.visit('/').login();
  });

  it('deletes a task', () => {
    cy.visit('/').login();
  });

  it('forces you to enter the next task', () => {
    cy.visit('/').login();
  });
});

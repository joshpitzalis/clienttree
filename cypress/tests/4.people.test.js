describe('outreach', () => {
  const fakeData = {
    name: 'Sick Rick',
    lastContacted: 'about a week ago',
    description: 'Pickle',
    updatedName: 'Skeletor',
  };

  it('lets you add a contact', () => {
    cy.visit('/')

      .findByTestId(/outreachPage/i)
      .findByText(/Add someone new/i)
      .click()
      .findByTestId(/contactModal/i)
      .findByPlaceholderText(/Their name/i)
      .clear()
      .type(fakeData.name)
      // .pickDate()
      // .findByPlaceholderText(/click to edit/i)
      // .type(fakeData.description)
      .findByText(/saved/i)
      .findByText(/close/i)
      .click()
      .queryByTestId(/contactModal/i)
      .should('not.exist')
      .findAllByText(fakeData.name);
  });

  it('lets you update a contact', () => {
    cy.visit('/')

      .findByTestId(/outreachPage/i)
      .findByText(fakeData.name)
      .click()
      .findByTestId(/contactModal/i)
      .wait(2000)
      .get('#name')
      .click()
      .clear()
      .type(fakeData.updatedName)
      .findByText(/saved/i)
      .findByText(/close/i)
      .click()
      .queryByTestId(/contactModal/i)
      .should('not.exist')
      .findByText(fakeData.updatedName)
      .queryByText(fakeData.name)
      .should('not.exist');
  });

  it('creates a task and completes a task  ', () => {
    cy.visit('/')
      // .login()
      .findByTestId(/outreachPage/i)
      .findByText(/getting started/i)
      .wait(5000)
      .findByText(fakeData.updatedName)
      .click()
      .findByTestId('addreminder')
      .click()
      .findByTestId('reminderBox')
      .findByPlaceholderText('About What?')
      .type('last task')
      .findByText(/create reminder/i)
      .click()
      .findByText(/last task/i)
      .click()
      .findByText(/confirm completed/i)
      .click()
      // also assert that the name changes in the sidebar when someone is selected
      .findByText(/getting started/i)
      .should('not.exist')
      .findByTestId('sidebar')
      .within(() => {
        cy.findByText(fakeData.updatedName);
      });
  });

  it('hides onboarding box when complete', () => {
    cy.visit('/')
      .findByTestId(/outreachPage/i)
      .wait(5000)
      .queryByText(/getting started/i)
      .should('not.exist')
      .findByText(/activities/i);
  });

  it('create a contact note', () => {
    cy.visit('/')
      .wait(5000)
      .findByText(fakeData.updatedName)
      .click()
      .findByPlaceholderText(/click to edit/i)
      .type('example note')
      .wait(5000)
      .findByText(/saved/i);
  });
  it('update a contact note', () => {
    cy.visit('/')
      .wait(5000)
      .findByText(fakeData.updatedName)
      .click()
      .findByText(/example note/i)
      .click()
      .findByText(/example note/i)
      .clear()
      .type('updated note')
      .wait(5000)
      .findByText(/saved/i);
  });
  it('delete a contact note', () => {
    cy.visit('/')
      .wait(5000)
      .findByText(fakeData.updatedName)
      .click()
      .findByText(/updated note/i)
      .click()
      .findByTestId('deleteNote')
      .click()
      .findByText(/confirm delete/i)
      .click()
      .queryByText(/updated note/i)
      .should('not.exist');
  });

  it('be able to add and complete a task to existing person on mobile', () => {
    cy.viewport('iphone-5');
    cy.visit('/')
      // .login()
      .wait(5000)
      .findByText(/add a reminder/i)
      .click()
      .get('.ant-input')
      .click()
      .type('s')
      .wait(5000)
      .type('{enter}')
      .findByPlaceholderText(/about what/i)
      .type('new task')
      .findByText(/create reminder/i)
      .click()

      .findByText(/due in 7 days/i)
      .findByText(/new task/i)

      .click()
      .findByText(/confirm completed/i)
      .click()
      .findByText(/due in 7 days/i)
      .should('not.exist');
  });

  it('be able to add and complete a task to a new person on mobile', () => {
    cy.viewport('iphone-5');
    cy.visit('/')
      // .login()
      .wait(5000)
      .findByText(/add a reminder/i)
      .click()
      .get('.ant-input')
      .click()
      .type('someone new')
      .findByPlaceholderText(/about what/i)
      .type('new task')
      .findByText(/create reminder/i)
      .click()

      .findByText(/due in 7 days/i)
      .findByText(/new task/i)

      .click()
      .findByText(/confirm completed/i)
      .click()
      .findByText(/due in 7 days/i)
      .should('not.exist');
  });

  it('lets you delete a contact', () => {
    cy.visit('/')
      .findByTestId(/outreachPage/i)
      .findByText(fakeData.updatedName)
      .click()
      .findByTestId(/contactModal/i)
      .findByTestId('deleteContact')
      .click()
      .findByTestId('confirmDeleteContact')
      .wait(1000)
      .click({ force: true })
      .wait(2000)
      .queryByTestId(/contactModal/i)
      .should('not.exist')
      .queryByText(fakeData.updatedName)
      .should('not.exist');
  });
});

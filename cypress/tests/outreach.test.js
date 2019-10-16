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

  it('lets you update a contact', () => {
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
    cy.visit('/')
      .findByText(/Welcome/i)
      .findByText(/outreach/i)
      .click()
      .findByTestId(/outreachPage/i)
      .findByText(fakeData.updatedName)
      .click()
      .findByTestId(/contactModal/i)
      .findByText(/delete/i)
      .click()
      .findByText(/confirm delete/i)
      .click()
      .wait(5000)
      .queryByTestId(/contactModal/i)
      .should('not.exist')
      .queryByText(fakeData.updatedName)
      .should('not.exist');
  });

  it.skip('delete buttons only show up for existing users', () => {
    cy.visit('/').login();
  });

  it.only('creates a task', () => {
    cy.visit('/').login();
  });

  it('ensures that when a contact is added the first task is created by default', () => {
    cy.visit('/').login();
  });

  it('ensures default tasks show up in network page task nibs and in universal task list', () => {
    cy.visit('/').login();
  });

  it('shows the number of active tasks on the network page', () => {
    cy.visit('/').login();
  });

  it('shows my helpful tasks in universal task list', () => {
    cy.visit('/').login();
  });

  it('only shows my helpful tasks in universal task list, not everyones', () => {
    cy.visit('/').login();
  });

  it('completes a task', () => {
    cy.visit('/').login();
  });

  it('completes a task from the universal task list', () => {
    cy.visit('/').login();
  });

  it('deletes a task', () => {
    cy.visit('/').login();
  });

  it('forces you to enter the next task', () => {
    cy.visit('/').login();
  });

  it('forces you to enter the next task from teh universal task list', () => {
    cy.visit('/').login();
  });

  context('task modal', () => {
    it('encourages you to always leave a next task', () => {
      ✅
    });

    it('encourages you to always leave a next task if there are completed tasks, just not active tasks', () => {
      ✅
    });

    

    it('pops up when you complete in universal task list', () => {
      ✅
    });

    it('pops up when you complete in universal task list, only if there is no active tasks left', () => {
      ✅
    });

    it('ensure task count updates when task is completed from universal task list', () => {
      ✅
    });
  });
});

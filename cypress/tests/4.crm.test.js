describe('outreach', () => {
  const fakeData = {
    name: 'Sick Rick',
    lastContacted: 'about a week ago',
    description: 'Pickle',
    updatedName: 'Skeletor',
  };

  it('lets you add a contact', () => {
    cy.visit('/')
      .findByTestId('salesDashboard')
      .findByTestId('networkPage')
      .click()
      .findByTestId(/outreachPage/i)
      .findByText(/Add someone new/i)
      .click()
      .findByTestId(/contactModal/i)
      .findByPlaceholderText(/Their name/i)
      .type(fakeData.name)
      .pickDate()
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
      .findByTestId('salesDashboard')
      .findByTestId('networkPage')
      .click()
      .findByTestId(/outreachPage/i)
      .findByText(fakeData.name)
      .click()
      .findByTestId(/contactModal/i)
      .wait(2000)
      .get('#name')
      .click()
      .clear()
      .type(fakeData.updatedName)
      .findByText(/save/i)
      .click()
      .wait(5000)
      .queryByTestId(/contactModal/i)
      .should('not.exist')
      .findByText(fakeData.updatedName)
      .queryByText(fakeData.name)
      .should('not.exist');
  });

  it('lets you delete a contact', () => {
    cy.visit('/')
      .findByTestId('salesDashboard')
      .findByTestId('networkPage')
      .click()
      .findByTestId(/outreachPage/i)
      .findByText(fakeData.updatedName)
      .click()
      .findByTestId(/contactModal/i)
      .findByTestId('deleteContact')
      .click()
      .findByTestId('deleteGuard')
      .findByTestId(/contactModal/i)
      .within(() =>
        cy
          .findByLabelText(/touch base with/i)
          .check()
          // .findByTestId('nevermindContactDelete')
          // .click()
          // .findByTestId('deleteContact')
          // .click()
          .findByTestId('confirmDeleteContact')
          .click()
      )
      .wait(5000)
      .queryByTestId(/contactModal/i)
      .should('not.exist')
      .queryByText(fakeData.updatedName)
      .should('not.exist');
  });

  it.skip('creates a task', () => {
    cy.visit('/').login();
  });

  context.skip('skipped', () => {
    it.skip('delete buttons only show up for existing users', () => {
      cy.visit('/').login();
    });

    it.skip('ensures that when a contact is added the first task is created by default', () => {
      cy.visit('/').login();
    });

    it.skip('ensures default tasks show up in network page task nibs and in universal task list', () => {
      cy.visit('/').login();
    });

    it.skip('shows the number of active tasks on the network page', () => {
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
  });

  context.skip('task modal', () => {
    it('encourages you to always leave a next task', () => {
      cy.visit('/');
    });

    it('encourages you to always leave a next task if there are completed tasks, just not active tasks', () => {
      cy.visit('/');
    });

    it('pops up when you complete in universal task list', () => {
      cy.visit('/');
    });

    it('pops up when you complete in universal task list, only if there is no active tasks left', () => {
      cy.visit('/');
    });

    it('ensure task count updates when task is completed from universal task list', () => {
      cy.visit('/');
    });

    it('adding someone from te universal task list creates the user and then creates teh task, and adds it to the universal task list', () => {
      cy.visit('/');
    });
  });
});

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
      .findByTestId('salesDashboard')
      .findByTestId('networkPage')
      .click()
      .findByTestId(/outreachPage/i)
      .findByText(fakeData.updatedName)
      .click()
      .findByTestId('addreminder')
      .click()
      .findByTestId('reminderBox')
      .findByPlaceholderText('What?')
      .type('last task')
      .findByText(/create reminder/i)
      .click()
      .queryByTestId('reminderBox')
      .should('not.exist')
      .findByTestId('last task')
      .check()
      .queryByTestId('reminderBox');
  });
  // it.skip('complete a task', () => {
  //   cy.visit('/').login();
  // });

  context.skip('notes', () => {
    it.skip('creates a note', () => {
      cy.visit('/').login();
    });
    it.skip('notes show up most recent first', () => {
      cy.visit('/').login();
    });
    it.skip('update a note', () => {
      cy.visit('/').login();
    });
    it.skip('change date on a note', () => {
      cy.visit('/').login();
    });
    it.skip('close date by clicking outside of box', () => {
      cy.visit('/').login();
    });
    it.skip('delete a note', () => {
      cy.visit('/').login();
    });
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
      // .findByTestId('deleteGuard')
      .findByTestId('confirmDeleteContact')
      .wait(1000)
      .click({ force: true })
      // .findByTestId(/contactModal/i)
      // .within(() =>
      //   cy
      //     .findByLabelText(/touch base with/i)
      //     .check()
      //     // .findByTestId('nevermindContactDelete')
      //     // .click()
      //     // .findByTestId('deleteContact')
      //     // .click()
      //     .findByTestId('confirmDeleteContact')
      //     .click()
      // )
      .wait(2000)
      .queryByTestId(/contactModal/i)
      .should('not.exist')
      .queryByText(fakeData.updatedName)
      .should('not.exist');
  });

  context.skip('skip', () => {
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

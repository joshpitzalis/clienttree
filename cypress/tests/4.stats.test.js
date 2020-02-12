describe('stats box', () => {
  const fakeData = {
    name: 'Slick Rick',
  };

  it('lets me add stats', () => {
    cy.visit('/')
      //  create a contact

      .findByTestId(/outreachPage/i)
      .findByText(/Add someone new/i)
      .click()
      .findByTestId(/contactModal/i)
      .findByPlaceholderText(/Their name/i)
      .clear()
      .type('fakeData.name')
      // .pickDate()
      // .findByPlaceholderText(/click to edit/i)
      // .type(fakeData.description)
      .findByText(/saved/i)
      .findByText(/close/i)
      .click()
      .queryByTestId(/contactModal/i)
      .should('not.exist')

      .findByText('fakeData.name')
      .click()

      // create and complete reminder
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

      .findByText(/close/i)
      .click()
      // proceed to hustle

      .findByText(/configure your hustle meter/i)
      .click()
      .findByTestId('incomeStatement')
      .findByTestId('goal')
      .clear()
      .type(10000)
      .wait(2000)
      .findByTestId('average')
      .clear()
      .type(2000)
      .wait(2000)
      .findByTestId('income')
      .clear({ force: true })
      .type(2465)
      .wait(2000)
      .findByText(
        'Landing 4 projects means you will need to pitch 12 leads, which means helping atleast 120 people.'
      )
      .findByTestId('close-button')
      .click({ force: true })
      .findByText('$ 2465')
      .findByTestId('statsTitle')
      .trigger('mouseover')
      .findByText('115')
      .findByText('12')
      .findByText('4');
  });

  it('updates stats when I move people into or out of leads', () => {
    cy.visit('/')

      .findByTestId('outreachPage')
      .findByText(/add someone new/i)
      .click()
      .findByPlaceholderText(/their name/i)
      .clear()
      .type(fakeData.name)
      // .pickDate()
      .findByPlaceholderText(/click to edit/i)
      .type('this is a note')
      // .queryByTestId('leadToggle')
      // .should('not.exist')
      // .findByText(/save/i)
      // .click()
      // .wait(5000)
      // .queryByTestId(/contactModal/i)
      // .should('not.exist')
      // .findAllByText(fakeData.name)
      // .first()
      // .click()
      .findByTestId('dashSwitch')
      .check({ force: true })
      .wait(1000)
      .findByTestId('closeBox')
      .click({ force: true })
      .get('[data-testid=projectPage] > .nav-link-text')
      .click()
      .findAllByTestId(fakeData.name)
      .findByText('$ 2465')
      .findByTestId('statsTitle')
      .trigger('mouseover')
      .findByText('4')
      .findAllByText('11');
  });

  it.only('updates stats when I move people into or out of project started', () => {
    cy.visit('/')
      .wait(5000)
      .findByTestId('projectPage')
      .click()
      .findByTestId('stage1')
      .within(() => cy.findByTestId(fakeData.name));
    cy.findByTestId(fakeData.name)
      .focus()
      .type(' ')
      .type(`{downarrow}`)
      .type(' ');
    cy.findByTestId('stage2').within(() => cy.findByTestId(fakeData.name));
  });

  //   when columns are rearranged, leads are added to first column

  //   when columns are rearranged, projects are incremented of removed from last column

  //  // https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/testing-dom__drag-drop/cypress/integration/drag_n_drop_spec.js

  // it('move people between stages', () => {
  //   cy.visit('/');
  // });

  // it('move stages around', () => {
  //   cy.visit('/');
  // });
});

describe('stats box', () => {
  const fakeData = {
    name: 'Slick Rick'
  }

  it('lets me add stats', () => {
    cy.visit('/')
      //  create a contact
      .wait(2000)
      .findByTestId(/outreachPage/i)
      .findByText(/Add someone new/i)
      .click()
      .findByTestId(/personCard/i)
      .findByPlaceholderText(/Their name/i)
      .clear()
      .type('fakeData.name')
      .findByText(/save changes/i).click()
      .findByText(/saving/i)
      .findByTestId('personCard')
      .should('not.be.visible')
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
      // proceed to hustle meter

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
      .findByText('4')
  })

  it('updates stats when I move people into or out of leads', () => {
    cy.visit('/')
      .wait(5000)
      .findByTestId('outreachPage')
      .findByText(/add someone new/i)
      .click()
      .findByPlaceholderText(/their name/i)
      .clear()
      .type(fakeData.name)

      .findByTestId('dashSwitch')
      .check({ force: true })

      .findByText(/save changes/i).click()
      .findByText(/saving/i)
      .get('[data-testid=projectPage] > .nav-link-text')
      .click()
      .findAllByTestId(fakeData.name)
      .findByText('$ 2465')
      .findByTestId('statsTitle')
      .trigger('mouseover')
      .findByText('4')
      .findAllByText('11')
  })

  it(' move people into or out of project started', () => {
    cy.visit('/')
      .wait(5000)
      .findByTestId('projectPage')
      .click()
      .findByTestId('stage1')
      .within(() => cy.findByTestId(fakeData.name))
    cy.findByTestId(fakeData.name)
      .focus()
      .type(' ')
      .type('{downarrow}')
      .type(' ')
    cy.findByTestId('stage2').within(() => cy.findByTestId(fakeData.name))
  })
  it.skip('updates stats when I move people into or out of project started')

  //   when columns are rearranged, leads are added to first column

  //   when columns are rearranged, projects are incremented of removed from last column

  //  // https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/testing-dom__drag-drop/cypress/integration/drag_n_drop_spec.js

  // it('move people between stages', () => {
  //   cy.visit('/');
  // });

  // it('move stages around', () => {
  //   cy.visit('/');
  // });
})

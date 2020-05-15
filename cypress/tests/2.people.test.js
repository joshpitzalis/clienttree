describe('outreach', () => {
  const fakeData = {
    name: 'Sick Rick',
    lastContacted: 'about a week ago',
    description: 'Pickle',
    updatedName: 'Skeletor',
    email: 'sick@rick.com',
    note: 'Pickle'
  }

  it('lets you CRUD contacts', () => {
    cy
      .visit('/')
      .login()
      .wait(5000)
      .findByTestId(/outreachPage/i)
    // check card opens
      .findByText(/Add someone new/i)
      .click()
      .findByTestId(/personCard/i)
    // is a new card type
      .findByText(/Click on the 'Save' button at the bottom when you are done/i)
      .queryByText(/Delete Contact/i)
      .should('not.exist')
    // can close card
      .findByText(/cancel/i).click()
      .queryByTestId(/personCard/i)
      .should('not.exist')
    // create card
      .findByText(/Add someone new/i)
      .click()
      .findByTestId(/personCard/i)
      .findByPlaceholderText(/Their name/i)
      .clear()
      .type(fakeData.name)
      .findByPlaceholderText(/Their email/i)
      .clear()
      .type(fakeData.email)
      .findByText(/Add an interaction/i).click()
      .findByPlaceholderText(/Add notes here/i).clear().type(fakeData.note)
      .findByText(/save note/i).click()
      .findByText(/save changes/i).click()
      .findByText(/saving/i)
      .findByTestId('personCard')
      .should('not.be.visible')
      .findAllByText(fakeData.name).first().click()
    // check data persisted
      .findByText(fakeData.email).should('exist')
      .findByText(fakeData.note).should('exist')
    // update a note
      .findByTestId(`${fakeData.note}-edit`).click()
      .findAllByText(fakeData.note).first().click().clear().type('updated note')
      .findByText(/save note/i).click()
      // add to work board
      .findByTestId('dashSwitch')
      .check({ force: true })
      .findByText(/save changes/i).click()
      .findByText(/saving/i)
      .findByTestId('personCard')
      .should('not.be.visible')
    // check it appears on workboard
      .findByTestId('projectPage')
      .click()
      .findByTestId('stage1')
      .within(() => cy.findByTestId(fakeData.name))
    // remove from workboard
      .findByTestId('networkPage')
      .click()
      .findAllByText(fakeData.name).first().click()
      .findByTestId(/personCard/i)
      .queryByText(/Delete Contact/i).click()
      .findByText('Must remove from the workboard first')
      .findByTestId('dashSwitch')
      .uncheck({ force: true })
      .findByText(/save changes/i).click()
      .findByText(/saving/i)
      .findByTestId('personCard')
      .should('not.be.visible')
      .findByTestId('projectPage')
      .click()
      .findByTestId('stage1')
      .within(() => cy.queryByTestId(fakeData.name).should('not.exist'))
      .findByTestId('networkPage')
      .click()
      .findAllByText(fakeData.name).first().click()
    // delete a note
      .findByText('updated note').should('exist').trigger('mouseover')
      .findByTestId('updated note-delete').click()
      .findByTestId('confirm-delete')
      .click()
      .queryByTestId(`${fakeData.note}-edit`)
      .should('not.exist')
    // delete contact

      .findAllByText(fakeData.name).first().click()
      .findByTestId(/personCard/i)
      .queryByText(/Delete Contact/i).click()
      .queryByText(/Confirm Delete/i).click()
      .wait(2000)
      .queryByText(fakeData.name)
      .should('not.exist')

    // name validation

    // notes validation
    // test form submission error alert

    // workboard validations
    // email validation
    // image validation
    // (depenancy injections)
    // test should work even when source data has that strange 9000 initial task in notes
    // create a task on a new contact
    // TK edit timestamp on a note
    // TK upload Image
  })

  it.skip('lets you add a contact', () => {
    cy.visit('/')
      .login()
      .wait(5000)
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
      .findAllByText(fakeData.name)
  })

  it.skip('lets you update a contact', () => {
    cy.visit('/')
      .wait(5000)
      .findByTestId(/outreachPage/i)
      .findByText(fakeData.name)
      .click()

      .findByTestId(/personCard/i)
      .findByTestId(`${fakeData.name}-edit`).click()
      .clear()
      .type(fakeData.updatedName)

      .findByText(/save changes/i).click()
      .findByText(/saving/i)
      .findByTestId('personCard')
      .should('not.be.visible')
      .findAllByText(fakeData.name).first().click()

      .findByText(fakeData.updatedName)
      .queryByText(fakeData.name)
      .should('not.exist')
  })

  it.skip('create a contact note', () => {
    cy.visit('/')
      .wait(5000)
      .findByText(fakeData.updatedName)
      .click()
      .findByPlaceholderText(/click to edit/i)
      .type('example note')
      .wait(5000)
      .findByText(/saved/i)
  })
  it.skip('update a contact note', () => {
    cy.visit('/')
      .wait(5000)
      .findByText(fakeData.updatedName)
      .click()
      .findByText(/example note/i)
      .click()
      .get('[data-testid=notesTextarea]')
      .clear()
      .wait(2000)
      .type('updated note')
      .wait(5000)
      .findByText(/saved/i)
  })
  it.skip('delete a contact note', () => {
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
      .should('not.exist')
  })

  it('be able to add and complete a task to existing person on mobile', () => {
    cy.viewport('iphone-5')
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
      .should('not.exist')
  })

  it('be able to add and complete a task to a new person on mobile', () => {
    cy.viewport('iphone-5')
    cy.visit('/')
      // .login()
      .wait(5000)
      .findByText(/add a reminder/i)
      .click()
      .get('.ant-input')
      .click()
      .type(fakeData.updatedName)
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
      .should('not.exist')
  })

  it.skip('check the person created on mobile shows up on desktop and lets you delete a contact', () => {
    cy.visit('/')
      .wait(5000)
      .findByTestId(/outreachPage/i)
      .findByText(fakeData.updatedName)
      .click()
      .findByTestId('personCard')
      .findByTestId('deleteContact')
      .click()
      .findByTestId('confirmDeleteContact')
      .wait(1000)
      .click({ force: true })
      .wait(2000)
      .queryByTestId(/personCard/i)
      .should('not.exist')
      .queryByText(fakeData.updatedName)
      .should('not.exist')
  })

  it('check the person created on mobile shows up on desktop and lets you create a task and completes a task on desktop', () => {
    cy.visit('/')
      .wait(5000)
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
        cy.findByText(fakeData.updatedName)
      })
  })
})

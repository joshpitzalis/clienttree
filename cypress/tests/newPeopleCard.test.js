describe('outreach', () => {
  const fakeData = {
    name: 'Sick Rick',
    email: 'sick@rick.com',
    lastContacted: 'about a week ago',
    note: 'Pickle',
    updatedName: 'Skeletor'
  }

  it('lets you CRUD contacts', () => {
    cy.visit('/')
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
      .findByTestId('dashSwitch')
      .check({ force: true })
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
      .queryByText(/Delete Contact/i).click()
      .queryByText(/Confirm Delete/i).click()
      .queryByText(fakeData.name)
      .should('not.exist')

    // name validation
    // delete validation
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
})

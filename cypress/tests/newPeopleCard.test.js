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
      .findByText(/save changes/i).click()
      .findByText(/saving/i)
      .findByTestId('personCard')
      .should('not.be.visible')
      .findAllByText(fakeData.name).first().click()
      .findByText('updated note').should('exist').trigger('mouseover')
      // delete a note
      .findByTestId('updated note-delete').click()
      .findByTestId('confirm-delete')
      .click()
      .queryByTestId(`${fakeData.note}-edit`)
      .should('not.exist')
      .queryByText(/Delete Contact/i).click()
      .queryByText(/Confirm Delete/i).click()
      .queryByText(fakeData.name)
      .should('not.exist')

    // TK edit timestamp on a note
    // TK upload Image

    // add to work board
    // remove from workboard

    // name validation
    // email validation
    // notes validation (depenancy injections)
    // image validation

    // test form submission error alert
    // test should work even when source data has that strange 9000 initial task in notes
    // create a task on a new contact
  })
})

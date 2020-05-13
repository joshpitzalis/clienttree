describe('outreach', () => {
  const fakeData = {
    name: 'Sick Rick',
    email: 'sick@rick.com',
    lastContacted: 'about a week ago',
    note: 'Pickle',
    updatedName: 'Skeletor'
  }

  it('lets you add a contact', () => {
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

    // change timestamp
    // delete notes
    // upload Image
    // add to work board
    // remove from workboard

    // name validation
    // email validation
    // notes validation
    // image validation

    // test form submission error alert
      .findByText(/save note/i).click()
      .findByText(/save changes/i).click()
      .findByText(/saving/i)
      .findByTestId('personCard')
      .should('not.be.visible')
      .findAllByText(fakeData.name).first().click()
      .findByText(fakeData.email).should('exist')
      .findByText(fakeData.note).should('exist')
      .findByTestId(`${fakeData.note}-edit`).click()
      .findAllByText(fakeData.note).first().click().clear().type('updated note')
      .findByText(/save note/i).click()
      .findByText(/save changes/i).click()
      .findByText(/saving/i)
      .findByTestId('personCard')
      .should('not.be.visible')
      .findAllByText(fakeData.name).first().click()
      .findByText('updated note').should('exist')
  })
// it.todo('create a task on a new contact')
  // it.todo('lets you update a contact')
  // it.todo('lets you delete a contact')
})

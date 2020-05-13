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

    // change note
    // change timestamp
    // delete notes

    // name validation
    // email validation
    // notes validation
    //  image validation

    // image upload
      .findByText(/save note/i).click()
      // test form submission error alert
      .findByText(/save changes/i).click()
      .findByText(/saving/i)
      // .findByText(/cancel/i).click()
      .findByTestId('personCard')
      .should('not.be.visible')
      .findAllByText(fakeData.name).first().click()
      .findByText(fakeData.email).should('exist')
      .findByText(fakeData.note).should('exist')
      // open form teh check email is persisted
      // check note is present
  })

  // it.todo('lets you update a contact')
  // it.todo('lets you delete a contact')
})

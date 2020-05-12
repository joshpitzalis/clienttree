describe('outreach', () => {
  const fakeData = {
    name: 'Sick Rick',
    lastContacted: 'about a week ago',
    description: 'Pickle',
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
      .findByText(/save changes/i).click()
      .findByText(/saving/i)
      // .findByText(/cancel/i).click()
      .findByTestId('personCard')
      .should('not.be.visible')
      .findAllByText(fakeData.name)
  })

  // it.todo('lets you update a contact')
  // it.todo('lets you delete a contact')
})

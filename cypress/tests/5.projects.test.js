describe('cms', () => {
  it('add a new stage', () => {
    cy.visit('/')
      .findByTestId('outreachPage')
      .findByTestId('projectPage')
      .click()
      .findByTestId('salesDashboard')
      .queryByText(/example/i)
      .should('not.exist')
      .findByText(/add a new step/i)
      .click()
      .findByPlaceholderText(/name your new stage/i)
      .type('example{enter}')
      .findByText(/example/i);
  });

  it('edit name of a stage', () => {
    cy.visit('/')
      .findByTestId('outreachPage')
      .findByTestId('projectPage')
      .click()
      .queryByText(/updated/i)
      .should('not.exist')
      .findByText(/Invoice Sent/i)
      .dblclick()
      .findByTestId('editableTitle')
      .clear()
      .type('updated{enter}')
      .findByText(/updated/i);
  });

  it('delete a stage', () => {
    cy.visit('/')
      .findByTestId('outreachPage')
      .findByTestId('projectPage')
      .click()
      .findByText(/updated/i)
      .dblclick()
      .findByText(/remove stage/i)
      .click()
      .findByText(/confirm destruction/i)
      .click()
      .queryByText(/updated/i)
      .should('not.exist');
  });
  it('cannot remove stage if someone is on it', () => {
    cy.visit('/')
      .findByTestId('outreachPage')
      .findByTestId('projectPage')
      .click()
      .findByText(/contacted/i)
      .dblclick()
      .findByText(/remove stage/i)
      .click()
      .findByText(
        /Remove all people from this stage before you can delete it/i
      );
  });

  it.skip('move a stage', () => {
    // cy.visit('/')
    //   .findByTestId('outreachPage')
    //   .findByTestId('projectPage')
    //   .click()
    //   .findByText(/invoice sent/i)
    //   .focus()
    //   .type(' ')
    //   .type(`{downarrow}{esc}`);
  });

  it.skip('reorder people within a stage', () => {
    cy.visit('/');
  });
});

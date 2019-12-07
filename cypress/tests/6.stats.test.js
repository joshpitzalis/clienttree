describe('stats box', () => {
  it.only('lets me add stats', () => {
    cy.visit('/')
      .findByTestId('salesDashboard')
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
      .clear()
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
      .findByText('118')
      .findByText('12')
      .findByText('4');
  });

  it('updates stats when I move people into or out of leads', () => {
    cy.visit('/');
  });

  it('updates stats when I move people into or out of project started', () => {
    cy.visit('/');
  });
});

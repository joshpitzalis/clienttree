describe.skip('stats box', () => {
  it.only('lets me add stats', () => {
    cy.visit('/')
      .findByTestId('salesDashboard')
      .findByText(/configure your hustle meter/i);
  });

  it('updates  stats when I move people into or out of leads', () => {
    cy.visit('/');
  });

  it('updates stats when I move people into or out of project started', () => {
    cy.visit('/');
  });
});

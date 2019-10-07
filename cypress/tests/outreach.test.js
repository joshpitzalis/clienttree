describe('outreach', () => {
  const fakeData = {
    name: 'Rick',
    designation: 'Pickle',
    clients: 'bears',
    problem: 'traps',
    website: 'abc.com',
  };

  it('lets you add a contact', () => {
    cy.visit('/').login();
  });

  it('lets you update a contact', () => {
    cy.visit('/').login();
  });

  it('lets you delete a contact', () => {
    cy.visit('/').login();
  });
});

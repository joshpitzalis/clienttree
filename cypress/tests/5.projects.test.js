describe.skip('cms', () => {
  context('crud', () => {
    it('add a new stage', () => {});

    it('edit name of a stage', () => {});

    it('delete a stage', () => {});
  });

  context('resources', () => {
    it('add a resource to a stage', () => {});

    it('delete a resource from a stage', () => {});
  });

  it('add new people to a stage directly', () => {
    cy.visit('/');
  });

  it('remove someone from a stage', () => {
    cy.visit('/');
  });

  it('delete someone from  any stage, not just the first one', () => {
    cy.visit('/');
  });

  it('reorder people within a stage', () => {
    cy.visit('/');
  });
});

describe.skip('stats box', () => {
  it('lets me add stats', () => {
    cy.visit('/');
  });

  it('updates  stats when I move people into or out of leads', () => {
    cy.visit('/');
  });

  it('updates stats when I move people into or out of project started', () => {
    cy.visit('/');
  });
});

describe.skip('cypress', () => {
  test('when columns are rearranged, leads are added to first column', () => {
    // https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/testing-dom__drag-drop/cypress/integration/drag_n_drop_spec.js
  });

  test('when columns are rearranged, projects are incremented of removed from last column', () => {});

  test('test adding to a new network works, on a virgin account', () => {});

  test('be able to remove josh form a virgin account', () => {});
});

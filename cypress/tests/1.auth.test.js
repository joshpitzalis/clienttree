Cypress.on('uncaught:exception', (err, runnable) => {
  console.log({ err })
  return false
})
describe('authentication', () => {
  it('lets you sign in and logout', () =>
    cy
      .visit('/')
      .login()
      .wait(5000)
      .findByTestId('outreachPage'))

  it('nav takes you to dashboard', () =>
    cy
      .visit('/')
      .wait(5000)
      .findByTestId('outreachPage')
      // click on icon
      .findByTestId('goToHomePage')
      .click()
      .findByTestId('outreachPage')
      .findByTestId('settings')
      .click()
      .findByText(/Logout/i)
      .click()
      .findByPlaceholderText(/email/i))
  it('when logged out nav takes you to login', () =>
    cy
      .visit('/')
      .queryByTestId('outreachPage')
      .should('not.exist')
      // click on icon
      .findByTestId('goToHomePage')
      .click()
      .queryByTestId('outreachPage')
      .should('not.exist'))
})

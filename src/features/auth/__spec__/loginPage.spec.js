import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { Login } from '../../../pages/Login'
import { Redirect as MockRedirect } from 'react-router-dom'

jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null)
  }
})

const mockProps = {
  authStatus: false,
  userId: '',
  email: 'test@test.com',
  password: '1234567'
}

describe('login page', () => {
  it('validates fields and redirects when you logged in', async () => {
    const { getByTestId, getByPlaceholderText, findByText, rerender } = render(<Login {...mockProps} />)

    // check validation works
    getByTestId('signInVersion')
    userEvent.click(getByTestId('authButton'))
    await findByText(/An email is required/i)
    await findByText(/a password is required/i)

    // check login works
    userEvent.type(getByPlaceholderText(/Email address/i), mockProps.email)
    userEvent.type(getByPlaceholderText(/Password/i), mockProps.password)
    userEvent.click(getByTestId('authButton'))
    await findByText(/Submitting/i)

    // mock login
    rerender(<Login
      authStatus
      userId='abc123'
    />)

    // assert redirect
    expect(MockRedirect).toHaveBeenCalled()
  })

  it('transitions between login states work as expected', async () => {
    const { getByTestId } = render(<Login {...mockProps} />)
    // sign in
    getByTestId('signInVersion')
    userEvent.click(getByTestId('switch'))
    // sign up
    getByTestId('signUpVersion')
    userEvent.click(getByTestId('goToPassword'))
    // password reset
    getByTestId('resetVersion')
    userEvent.click(getByTestId('switch'))
    getByTestId('signInVersion')
  })
})

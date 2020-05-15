import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { render } from '../../../utils/testSetup'
import { PersonModal } from '../components/PersonBox'

const mockProps = {
  uid: '345',
  contactId: '123',
  onClose: jest.fn(),
  handleTracking: jest.fn(),
  handleDelete: jest.fn(),
  newPerson: false
}

const mockStore = {
  initialState: {
    contacts: [
      {
        uid: '123',
        email: 'test@email.com'
      }
    ]
  }
}

describe('people Box', () => {
  it('if email adds email details to user box', () => {
    const { getByTestId, getByText } = render(<PersonModal {...mockProps} />, {
      ...mockStore
    })
    userEvent.click(getByTestId('emailBox'))
    getByText('test@email.com')
  })
  it('if no email then social link is blank', () => {
    const { getByTestId, getByPlaceholderText, getByText } = render(
      <PersonModal {...mockProps} />
    )

    userEvent.click(getByTestId('emailBox'))
    getByText(/Click here to add email.../i)
    userEvent.click(getByText(/Click here to add email.../i))
    getByPlaceholderText(/Add email.../i)
  })
  it.todo(
    'clicking on icon reveals detail and close button, but hides email icon'
  )
  it.todo('lets me add an email ')
  it.todo('lets me edit an email ')
  it.todo('lets me remove an email ')

  it.todo('close button hides detail, reveals mail icon')

  it.todo('if no email then icon is at half opacitys')
  it.todo('avatars fall back')
  it.todo('uploaded image over writes fall back avatar')

  it.todo('success import - undefined in banner')

  it.todo('names dont always appear /annie')
  it.todo('email is in upper case for some reason')
  it.todo(
    'shut down email box should sto it being editable, or if saving become false'
  )

  it.todo('when you create someone default date is one year ago')
  it.todo('when you create someone onmobile default date is one year ago')
  it.todo('when you update someone with a note it changes last contacted')
  it.todo(
    'if last contacted or notes dates are corrupted it just doesnt return a last comtacted value'
  )
  it.todo('colours boredrs on person box correspond to last udated value')
})

describe('new people Card', () => {
  it.todo('blank state when create new contact')
  it.todo('show contact data')

  it.todo('test transition between edtable and presentational')
  it.todo('nice slow animation transition between edtable and presentational')

  it.todo('has an active state, edit state, and error state')
  it.todo('save and delete')
  it.todo('fall back avatar image')
  it.todo('edit thumbnail')
  it.todo('show thumbnail uplaoding status')
  it.todo('show thumbnail uplaoding error')
  it.todo('edit name')
  it.todo('edit email')
  it.todo('add to workboard')
  it.todo('add interaction')
  it.todo('edit interaction')
  it.todo('show contact data')
  it.todo('different heaidng if new person')
  it.todo('default image shows first and last initial')
  it.todo('default image starts as ct')
  it.todo('default image reverts to ct if blank')
  it.todo('doesnt show delete if new contact')
  it.todo('disable save if nothing to save')
})

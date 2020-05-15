import '@testing-library/jest-dom/extend-expect'
import React from 'react'
// import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/testSetup'
import { Counters, InsightsBox, findRecentlyContacted } from '../InsightsBox'

const mockProps = {
  people: 56,
  inTouchWith: 45,
  thisWeek: 2
}

describe('insights Box', () => {
  test('shows number of people, in touch with and contacted this week', () => {
    const { getByText } = render(<Counters {...mockProps} />)
    getByText('56')
    getByText('45')
    getByText('2')
  })

  test('calculate the correct number of people', () => {
    const { getByText } = render(<InsightsBox {...mockProps} />, {
      initialState: {
        contacts: [
          {
            uid: '6JMnxuPNHOXV4H'
          },
          {
            uid: 'hYK6JMnxuPNHOXV4'
          },
          {
            uid: 'MnxuPNHOXV'
          }
        ]
      }
    })
    getByText('3')
  })

  test('calculate the correct number of in touch with', () => {
    const { getByText, getByTestId } = render(<InsightsBox {...mockProps} />, {
      initialState: {
        contacts: [
          {
            uid: '6JMnxuPNHOXV4H',
            lastContacted: 1549869638062
          },
          {
            uid: 'hYK6JMnxuPNHOXV4',
            lastContacted: 1580971404642
          },
          {
            uid: 'MnxuPNHOXV',
            lastContacted: 1549869638062
          }
        ]
      }
    })
    expect(getByTestId('inTouchWith')).toHaveTextContent(1)
    getByText('33%')
  })

  test('calculate the correct number of in contacted this week', () => {
    const { getByTestId } = render(<InsightsBox {...mockProps} />, {
      initialState: {
        contacts: [
          {
            uid: '6JMnxuPNHOXV4H',
            lastContacted: 1549869638062
          },
          {
            uid: 'hYK6JMnxuPNHOXV4',
            lastContacted: 1581664501364
          },
          {
            uid: 'MnxuPNHOXV',
            lastContacted: 1581664501373
          }
        ]
      }
    })
    expect(getByTestId('contacted7Days')).toHaveTextContent(2)
  })

  test('findRecentlyContacted does exactly that', () => {
    const store = {
      contacts: [
        {
          activeTaskCount: 1,
          email: 'sven@nk.dev',
          lastContacted: 1549869638062,
          name: 'Sten Someone',
          notes: {
            9007199254740991: {
              id: 9007199254740991,
              lastUpdated: 9007199254740991,
              text: ''
            }
          },
          photoURL: 'https://ui-avatars.com/api/?name=steven abadie',
          summary: '',
          uid: 'K6OhYK6JMnxuPNHOXV4H'
        },
        {
          activeTaskCount: 1,
          email: 'raln@gmal.com',
          lastContacted: 1550048822605,
          name: 'rao',
          notes: {
            9007199254740991: {
              id: 9007199254740991,
              lastUpdated: 9007199254740991,
              text: ''
            }
          },
          photoURL: 'https://ui-avatars.com/api/?name=raoul nanavati',
          summary: '',
          uid: 'YuzL1KpChXX7ViPpvjei'
        },
        {
          activeTaskCount: 1,
          email: 'bhara@gil.com',
          lastContacted: 1580971404642,
          name: 'Someone else',
          notes: {
            9007199254740991: {
              id: 9007199254740991,
              lastUpdated: 9007199254740991,
              text: ''
            }
          },
          photoURL: '',
          summary: '',
          uid: '9RdLbU3BwbWRkKRiI5nk'
        },
        {
          activeTaskCount: 1,
          email: 'akit@ene.in ',
          lastContacted: 1580971404642,
          name: 'Example Contact',
          notes: {
            9007199254740991: {
              id: 9007199254740991,
              lastUpdated: 9007199254740991,
              text: ''
            }
          },
          photoURL: '',
          summary: '',
          uid: 'mNYy7UjILdtZgu06aE7l'
        },
        {
          activeTaskCount: 1,
          email: 'and@gmail.com',
          lastContacted: 1581485471752,
          name: 'Example ',
          notes: {
            1581324448708: {
              id: 1581324448708,
              lastUpdated: 1581324448708,
              text: 'm\n'
            },
            9007199254740991: {
              id: 9007199254740991,
              lastUpdated: 9007199254740991,
              text: ''
            }
          },
          photoURL: '',
          summary: '',
          uid: 'sm3mQ6chR5wObmFVvbdD'
        },
        {
          activeTaskCount: 1,
          email: 'raju@kau.in',
          lastContacted: 1581485547116,
          name: 'raju',
          notes: {
            9007199254740991: {
              id: 9007199254740991,
              lastUpdated: 9007199254740991,
              text: ''
            }
          },
          photoURL: '',
          summary: '',
          uid: '5xfsqSC9Umbz0RSjgkQu'
        },
        {
          activeTaskCount: 1,
          email: 'Alex@gml.com',
          lastContacted: 1581485617886,
          name: 'Alex ',
          notes: {
            9007199254740991: {
              id: 9007199254740991,
              lastUpdated: 9007199254740991,
              text: ''
            }
          },
          photoURL: '',
          summary: '',
          uid: 'NMcUk1tNLkekrXFK4g5x'
        },
        {
          activeTaskCount: 1,
          email: 'ann@gmail.com',
          lastContacted: 1581485631550,
          name: 'Anni ',
          notes: {
            9007199254740991: {
              id: 9007199254740991,
              lastUpdated: 9007199254740991,
              text: ''
            }
          },
          photoURL: '',
          summary: '',
          uid: 'VuhmqferTGhJDzRrNzdS'
        }
      ]
    }
    const sixMonthsAgo = 1.577e10
    expect(findRecentlyContacted(store.contacts, sixMonthsAgo)).toEqual(6)
  })

  test('findRecentlyContacted should update last interaction on edit box as well', () => {})

  test.skip('adding a note updates last contacted and in touch with', () => {})

  test.todo('deleting teh note reverts this')

  test.todo('tool tips for each stat')
  test.todo('colour bars for the stats')

  test.todo('sparklines hold histori data')
  test.todo('when historic data gets deleted sparklines update')

  test.todo('only one contact box open at a time')
  test.todo('formik refactor')
  test.todo('rmeove auto save')
  test.todo('click animation on contact cards')
  test.todo('null on import banner')
})

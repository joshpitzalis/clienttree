import React from 'react'
import PropTypes from 'prop-types'
import { Route, Link, useLocation } from 'react-router-dom'
import { ofType } from 'redux-observable'
import { map, catchError, switchMap } from 'rxjs/operators'
import { of, merge } from 'rxjs'
import { doc, collection } from 'rxfire/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { createSlice } from '@reduxjs/toolkit'
import { NavPanel, NavLink, ContainerHorizontal } from '@duik/it'
import { OptimizelyFeature } from '@optimizely/react-sdk'
// import { HelpfulTaskList as UniversalTaskList } from '../features/people/components/UniversalTaskList'
// import { FeatureContext } from '../features/featureboard';
// import { SpecificTaskList } from '../features/people/components/SpecificTaskList'
import People from '../images/People'
import Home from '../images/Home'
import Check from '../images/Check'
import firebase from '../utils/firebase'
import { Network } from '../features/people/Network'
import { Profile } from '../features/profile/Profile'
import { CRM } from '../features/projects/dashboard'
import { ConfettiBanner } from '../features/onboarding/confetti'
// import { Onboarding } from '../features/onboarding/ActivityList'
import StatsBox from '../features/stats/StatsBox'
import { taskSlice } from '../features/people/taskSlice'
import Modal from '../features/people/components/ContactModal'
import Portal from '../utils/Portal'
import { MobileReminder } from '../features/people/components/MobileReminder'
import {
  useRecoilState,
  atom
} from 'recoil'

export const reminderModalState = atom({
  key: 'reminderModalState', // unique ID (with respect to other atoms/selectors)
  default: false // default value (aka initial value)
})

export const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    setProfile: (state, action) => action.payload
  }
})

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState: null,
  reducers: {
    setContacts: (state, action) => action.payload
  }
})

export const fetchUserDataEpic = (
  action$
  // store,
  // { setFirebaseContactUpdate }
) =>
  action$.pipe(
    ofType('dashboard/fetchUserData'),
    switchMap(({ payload }) => {
      const userId = payload
      return merge(
        doc(
          firebase
            .firestore()
            .collection('users')
            .doc(userId)
        ).pipe(
          map(user => userSlice.actions.setProfile(user.data())),
          catchError(error =>
            of({
              error: true,
              type: 'dashboard/userDataError',
              payload: error,
              meta: { source: 'fetchUserDataEpic' }
            })
          )
        ),
        collection(
          firebase
            .firestore()
            .collectionGroup('helpfulTasks')
            .where('connectedTo', '==', userId)
        ).pipe(
          map(docs => {
            const helpfulTasks = docs.map(d => d.data())
            const serializedTasks = helpfulTasks.map(_task => ({
              ..._task,
              dateCreated: _task.dateCreated && _task.dateCreated.nanoseconds,
              dateCompleted:
                _task.dateCompleted && _task.dateCompleted.nanoseconds
            }))
            return taskSlice.actions.setTasks(serializedTasks)
          }),
          catchError(error =>
            of({
              error: true,
              type: 'dashboard/helpfulTaskError',
              payload: error,
              meta: { source: 'fetchUserDataEpic' }
            })
          )
        ),
        collection(
          firebase
            .firestore()
            .collection('users')
            .doc(userId)
            .collection('contacts')
        ).pipe(
          map(docs => {
            const contacts = docs.map(d => d.data())
            return contactsSlice.actions.setContacts(contacts)
          }),
          catchError(error =>
            of({
              error: true,
              type: 'dashboard/contactError',
              payload: error,
              meta: { source: 'fetchUserDataEpic' }
            })
          )
        )
      )
    })
  )

/** @param {{
 * userId: string
 * }} [Props] */

/* eslint-disable react/prop-types */
export function Dashboard ({ userId }) {
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (userId) {
      dispatch({ type: 'dashboard/fetchUserData', payload: userId })
    }
  }, [dispatch, userId])

  const selectedUserUid = useSelector(
    store => store.people && store.people.selectedContact
  )
  const [visible, setVisibility] = useRecoilState(reminderModalState)

  return (
    <ContainerHorizontal>
      <ConfettiBanner />
      {/* {visible && <ReminderModal showModal={visible}
        toggleModal={setVisibility} />} */}
      {visible && (
        <Portal onClose={() => setVisibility(false)}>
          <Modal
            uid={userId}
            selectedUserUid={selectedUserUid}
            onClose={() => {
              setVisibility(false)
            }}

          />
        </Portal>
      )}
      <OptimizelyFeature feature='workboard'>
        {workboard => {
          return (
            <div
              className={`flex flex-row-ns flex-column w-100  ${
              workboard ? 'justify-between' : 'justify-end'
            }  min-h-100 bg-base`}
            >
              {workboard && <Navigation userId={userId} />}
              <main
                className={`dn db-ns  w-100 min-h-100 ml4 ${
                workboard ? 'justify-between' : 'justify-end'
              }`}
              >
                <Route
                  exact
                  path='/user/:uid/network'
                  render={props => <Network {...props} uid={userId}
                  />}
                />
                {userId && (
                  <Route
                    exact
                    path='/user/:uid/dashboard'
                    render={props => <CRM {...props} userId={userId} />}
                  />
                )}
                <Route
                  exact
                  path='/user/:uid/profile'
                  render={props => <Profile {...props} />}
                />
              </main>

              <aside
                className='w-100 dn-ns bg-transparent tc'
                data-testid='sidebar'
              >
                <MobileReminder myUid={userId} />
                {/* <Onboarding uid={userId} contactSelected={selectedUserUid}> */}
                {/* <>
                    {selectedUserUid ? (
                      <>
                        <button
                          type='button'
                          data-testid='addreminder'
                          onClick={() => setVisibility(true)}
                          className='btn2 ph4 pv3 bn pointer br1 grow b mv4'
                        >
                        Add A Reminder
                        </button>
                        <SpecificTaskList
                          myUid={userId}
                          contactSelected={selectedUserUid}
                        />
                      </>
                    ) : (
                    // <OptimizelyFeature feature="insights">
                    //   {insights =>
                    //     !insights && <UniversalTaskList myUid={userId} />
                    //   }
                    // </OptimizelyFeature>
                      <UniversalTaskList myUid={userId} />
                    )}
                  </> */}
                {/* </Onboarding> */}
              </aside>
            </div>
          )
        }}
      </OptimizelyFeature>
    </ContainerHorizontal>
  )
}

function Navigation ({ userId }) {
  const { pathname } = useLocation()

  const contacts = useSelector(store => store.contacts)
  return (
    <NavPanel
      dark
      className='flex-ns dn flex-column justify-between min-vh-100 '
    >
      <div className='mt5'>
        <NavLink
          leftEl={<Home className='o-75 h1' />}
          Component={Link}
          data-testid='projectPage'
          to={`/user/${userId}/dashboard`}
          className={`${pathname === `/user/${userId}/dashboard` &&
              'active'}  tracked pb2 `}
        >
          <span className='relative' style={{ bottom: '1px' }}>
              Pipeline
          </span>
        </NavLink>

        <NavLink
          leftEl={<Check className='o-75 h1' color='currentColor' />}
          Component={Link}
          data-testid='projectPage'
          to={`/user/${userId}/tasks`}
          className={`${pathname === `/user/${userId}/tasks` &&
              'active'}  tracked pb2 `}
        >
          <span className='relative' style={{ bottom: '1px' }}>
              Actions
          </span>
        </NavLink>

        {contacts && !!contacts.length && (
          <NavLink
          // rightEl="🚝"
            leftEl={<People className='o-75 h1' />}
            Component={Link}
            to={`/user/${userId}/network`}
            className={`${pathname === `/user/${userId}/network` &&
            'active'} tracked pb2`}
            data-testid='networkPage'
          >
          People
          </NavLink>
        )}
      </div>
      <OptimizelyFeature feature='workboard'>
        {isEnabled => isEnabled && <StatsBox userId={userId} />}
      </OptimizelyFeature>
    </NavPanel>
  )
}

Navigation.propTypes = { userId: PropTypes.string }
Navigation.defaultProps = { userId: '' }

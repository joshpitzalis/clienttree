import React from 'react';
import PropTypes from 'prop-types';
import { Route, Link, useLocation } from 'react-router-dom';
import { ofType } from 'redux-observable';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of, merge } from 'rxjs';
import { doc, collection } from 'rxfire/firestore';
// import { PrivateRoute } from '../features/auth/PrivateRoute';
import { useDispatch, useSelector } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';
import {
  NavPanel,
  NavLink,
  ContainerHorizontal,
  Tabs,
  TabItem,
} from '@duik/it';
import { Input } from '../features/people/components/Input';
import { HelpfulTaskList as UniversalTaskList } from '../features/people/components/UniversalTaskList';
import { SpecificTaskList } from '../features/people/components/SpecificTaskList';
import People from '../images/People';
import Home from '../images/Home';
import firebase from '../utils/firebase';
import { Network } from '../features/people/Network';
import { Profile } from '../features/profile/Profile';
import { CRM } from '../features/projects/dashboard';
import { ConfettiBanner } from '../features/onboarding/confetti';
import { Onboarding } from '../features/onboarding/ActivityList';
import StatsBox from '../features/stats/StatsBox';
import { taskSlice } from '../features/people/taskSlice';
import Modal from '../features/people/components/ContactModal';
import Portal from '../utils/Portal';

export const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    setProfile: (state, action) => action.payload,
  },
});
export const contactsSlice = createSlice({
  name: 'contacts',
  initialState: null,
  reducers: {
    setContacts: (state, action) => action.payload,
  },
});

export const fetchUserDataEpic = (
  action$
  // store,
  // { setFirebaseContactUpdate }
) =>
  action$.pipe(
    ofType('dashboard/fetchUserData'),
    switchMap(({ payload }) => {
      const userId = payload;
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
              meta: { source: 'fetchUserDataEpic' },
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
            const helpfulTasks = docs.map(d => d.data());
            const serializedTasks = helpfulTasks.map(_task => ({
              ..._task,
              dateCreated: _task.dateCreated && _task.dateCreated.nanoseconds,
              dateCompleted:
                _task.dateCompleted && _task.dateCompleted.nanoseconds,
            }));
            return taskSlice.actions.setTasks(serializedTasks);
          }),
          catchError(error =>
            of({
              error: true,
              type: 'dashboard/helpfulTaskError',
              payload: error,
              meta: { source: 'fetchUserDataEpic' },
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
            const contacts = docs.map(d => d.data());
            return contactsSlice.actions.setContacts(contacts);
          }),
          catchError(error =>
            of({
              error: true,
              type: 'dashboard/contactError',
              payload: error,
              meta: { source: 'fetchUserDataEpic' },
            })
          )
        )
      );
    })
  );

/** @param {{userId: string}} [Props] */
export function Dashboard({ userId }) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (userId) {
      dispatch({ type: 'dashboard/fetchUserData', payload: userId });
    }
  }, [dispatch, userId]);

  const selectedUserUid = useSelector(store => store.people.selectedContact);

  const [visible, setVisibility] = React.useState(false);

  return (
    <ContainerHorizontal>
      <ConfettiBanner />
      {visible && (
        <Portal onClose={() => setVisibility(false)}>
          <Modal
            uid={userId}
            selectedUserUid={selectedUserUid}
            onClose={() => {
              setVisibility(false);
            }}
          />
        </Portal>
      )}
      <div className="flex flex-row-ns flex-column w-100 justify-between min-h-100 bg-base">
        <Navigation userId={userId} />
        <main className="w-50-ns w-100 min-h-100">
          <Route
            exact
            path="/user/:uid/network"
            render={props => <Network {...props} uid={userId} />}
          />
          {userId && (
            <Route
              exact
              path="/user/:uid/dashboard"
              render={props => <CRM {...props} userId={userId} />}
            />
          )}
          <Route
            exact
            path="/user/:uid/profile"
            render={props => <Profile {...props} />}
          />
        </main>
        <aside className="dn dib-ns">
          <NavPanel onRight className="bn">
            <Onboarding uid={userId} contactSelected={selectedUserUid}>
              <>
                {selectedUserUid ? (
                  <>
                    <button
                      type="button"
                      data-testid="addreminder"
                      onClick={() => setVisibility(true)}
                      className="btn2 ph4 pv3 bn pointer br1 grow b mv4"
                    >
                      Add A Reminder
                    </button>
                    <SpecificTaskList
                      myUid={userId}
                      contactSelected={selectedUserUid}
                    />
                  </>
                ) : (
                  <UniversalTaskList myUid={userId} />
                )}
              </>
            </Onboarding>
            <p className="tc f6 white ma0">
              Version {process.env.REACT_APP_VERSION}
            </p>
          </NavPanel>
        </aside>
      </div>
    </ContainerHorizontal>
  );
}

const MobileNav = ({ userId }) => {
  const { pathname } = useLocation();
  const contacts = useSelector(store => store.contacts);
  return (
    <Tabs>
      <TabItem
        to={`/user/${userId}/network`}
        className={`${pathname === `/user/${userId}/network` &&
          'active'}  tracked w-50 tc`}
        data-testid="networkTab"
      >
        <People className="o-75 h1" /> People
      </TabItem>
      {contacts && !!contacts.length && (
        <TabItem
          data-testid="projectPage"
          to={`/user/${userId}/dashboard`}
          className={`${pathname === `/user/${userId}/dashboard` &&
            'active'}  tracked w-50 tc`}
        >
          <Home className="o-75 h1" /> Workboard
        </TabItem>
      )}
    </Tabs>
  );
};

MobileNav.propTypes = { userId: PropTypes.string };
MobileNav.defaultProps = { userId: '' };

function Navigation({ userId }) {
  const { pathname } = useLocation();

  const contacts = useSelector(store => store.contacts);
  return (
    <>
      {/* <div className="dn-ns">
        <MobileNav userId={userId} />
      </div> */}
      <NavPanel
        dark
        className="flex-ns dn flex-column justify-between min-vh-100 "
      >
        <div className="mt5">
          <NavLink
            // rightEl="🚝"
            leftEl={<People className="o-75 h1" />}
            Component={Link}
            to={`/user/${userId}/network`}
            className={`${pathname === `/user/${userId}/network` &&
              'active'}  tracked pb2`}
            data-testid="networkPage"
          >
            People
          </NavLink>
          {contacts && !!contacts.length && (
            <NavLink
              leftEl={<Home className="o-75 h1" />}
              Component={Link}
              data-testid="projectPage"
              to={`/user/${userId}/dashboard`}
              className={`${pathname === `/user/${userId}/dashboard` &&
                'active'}  tracked pb2 `}
            >
              <span className="relative" style={{ bottom: '1px' }}>
                Workboard
              </span>
            </NavLink>
          )}
        </div>

        <StatsBox userId={userId} />
      </NavPanel>
    </>
  );
}

Navigation.propTypes = { userId: PropTypes.string };
Navigation.defaultProps = { userId: '' };

const AddNewTask = () => {
  const [state, setState] = React.useState({
    activity: '',
    date: '',
  });

  return (
    <form className="ma0 pa0 mv4">
      <Input
        setState={setState}
        state={state}
        value={state.activity}
        name="Add"
        placeholder="Add an activity.."
        className="mb0"
      />
      {/* <small className="text-3">Include Deadline</small> */}
      {/* <Input
        setState={setState}
        state={state}
        value={state.date}
        name="date"
        type="date"
      /> */}
    </form>
  );
};

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Link, useLocation } from 'react-router-dom';
import { doc } from 'rxfire/firestore';
// import { PrivateRoute } from '../features/auth/PrivateRoute';
import { useDispatch, useSelector } from 'react-redux';
import { createSlice } from 'redux-starter-kit';
import { catchError } from 'rxjs/operators';
import { NavPanel, NavLink, ContainerHorizontal } from '@duik/it';
import People from '../images/People';
import Home from '../images/Home';
import firebase from '../utils/firebase';
import { toast$ } from '../features/notifications/toast';
import { Network } from '../features/people/Network';
import { Profile } from '../features/profile/Profile';
import { CRM } from '../features/projects/dashboard';
import { ConfettiBanner } from '../features/onboarding/confetti';
import { Onboarding } from '../features/onboarding/ActivityList';
import StatsBox from '../features/stats/StatsBox';

export const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    setProfile(state, action) {
      const { payload } = action;
      return payload;
      // state.clients = payload.clients;
      // state.designation = payload.designation;
      // state.name = payload.name;
      // state.service = payload.service;
      // state.userId = payload.userId;
      // state.website = payload.website;
    },
    // setStats(state, action) {
    //   const { payload } = action;
    //   state.stats = payload;
    // },
    // setServices(state, action) {
    //   const { payload } = action;
    //   state.services = payload;
    // },
    // setOnboarding(state, action) {
    //   const { payload } = action;
    //   state.onboarding = payload;
    // },
    // setDashboard(state, action) {
    //   const { payload } = action;
    //   state.dashboard = payload;
    // },
  },
});

const propTypes = { userId: PropTypes.string };

const defaultProps = { userId: '' };

export function Dashboard({ userId }) {
  // const [welcomeMessage, setWelcomeMessage] = React.useState({
  //   header: 'Welcome!',
  //   byline: '',
  // });
  const dispatch = useDispatch();
  const userState = useSelector(store => store.user);
  console.log({ userState });

  React.useEffect(() => {
    if (userId) {
      // const subscription = firebase
      //   .firestore()
      //   .collection('users')
      //   .doc(userId)
      //   .onSnapshot(snap => {
      //     const {
      //       setProfile,
      //       setStats,
      //       setServices,
      //       setOnboarding,
      //       setDashboard,
      //     } = userSlice.actions;

      //     const payload = snap.data();

      //     const {
      //       clients,
      //       designation,
      //       name,
      //       service,
      //       userId: uid,
      //       website,
      //       dashboard,
      //     } = payload;
      //     const oldProfile = '';
      //     // tk get old profile from state

      //     const profileChanged =
      //       oldProfile !==
      //       {
      //         clients,
      //         designation,
      //         name,
      //         service,
      //         uid,
      //         website,
      //       };
      //     if (profileChanged) {
      //       dispatch(setDashboard({ dashboard }));
      //       dispatch(
      //         setProfile({
      //           clients,
      //           designation,
      //           name,
      //           service,
      //           uid,
      //           website,
      //         })
      //       );
      //     }
      //   });

      const subscription = doc(
        firebase
          .firestore()
          .collection('users')
          .doc(userId)
      )
        .pipe(
          catchError(error =>
            toast$.next({ type: 'ERROR', message: error.message || error })
          )
        )
        .subscribe(user => {
          const { setProfile } = userSlice.actions;
          const newUser = user.data();
          dispatch(setProfile(newUser));
        });

      return () => subscription.unsubscribe();
    }
  }, [dispatch, userId]);

  const { pathname } = useLocation();

  return (
    <ContainerHorizontal>
      <ConfettiBanner
      // setWelcomeMessage={setWelcomeMessage}
      />
      <div className="flex w-100 justify-between min-h-100 bg-base">
        <NavPanel dark className="flex flex-column justify-between min-vh-100">
          <div className="mt5">
            <NavLink
              leftEl={<Home className="o-75 h1" />}
              Component={Link}
              data-testid="projectPage"
              to={`/user/${userId}/dashboard`}
              className={`${pathname === `/user/${userId}/dashboard` &&
                'active'}  tracked pb2`}
            >
              Projects
            </NavLink>

            {/* <NavLink
              leftEl="💸"
              className={pathname === `/user/${userId}/profile` && 'active'}
              Component={Link}
              to={`/user/${userId}/profile`}
            >
              Services
            </NavLink> */}
            <NavLink
              leftEl={<People className="o-75 h1" />}
              Component={Link}
              to={`/user/${userId}/network`}
              className={`${pathname === `/user/${userId}/network` &&
                'active'}  tracked pb2`}
              data-testid="networkPage"
            >
              People
            </NavLink>
            {/* <NavLink rightEl="🚝">With left and right el</NavLink> */}
          </div>

          <StatsBox userId={userId} />
        </NavPanel>

        <div className="w-50  min-h-100">
          {userId && (
            <Route
              exact
              path="/user/:uid/dashboard"
              render={props => (
                <CRM
                  {...props}
                  // welcomeMessage={welcomeMessage}
                  userId={userId}
                />
              )}
            />
          )}
          <Route
            exact
            path="/user/:uid/profile"
            render={props => <Profile {...props} />}
          />
          <Route
            exact
            path="/user/:uid/network"
            render={props => <Network {...props} uid={userId} />}
          />
        </div>

        <NavPanel onRight className="bn">
          <Onboarding uid={userId} />
          <p className="tc f6 white ma0">
            Version {process.env.REACT_APP_VERSION}
          </p>
        </NavPanel>
      </div>
    </ContainerHorizontal>
  );
}

Dashboard.propTypes = propTypes;
Dashboard.defaultProps = defaultProps;

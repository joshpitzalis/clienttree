import React from 'react';
import PropTypes from 'prop-types';
import { Route, Link, useLocation } from 'react-router-dom';
import { doc } from 'rxfire/firestore';
// import { PrivateRoute } from '../features/auth/PrivateRoute';
import { useDispatch } from 'react-redux';
import { createSlice } from 'redux-starter-kit';
import { catchError } from 'rxjs/operators';
import {
  NavPanel,
  NavLink,
  ContainerHorizontal,
  Tabs,
  TabItem,
} from '@duik/it';
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
    },
  },
});

const propTypes = { userId: PropTypes.string };
const defaultProps = { userId: '' };

export function Dashboard({ userId }) {
  const dispatch = useDispatch();
  // const userState = useSelector(store => store.user);

  React.useEffect(() => {
    if (userId) {
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

  return (
    <ContainerHorizontal>
      <ConfettiBanner />
      <div className="flex flex-row-ns flex-column w-100 justify-between min-h-100 bg-base">
        <Navigation userId={userId} />
        <main className="w-50-ns w-100 min-h-100">
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
          <Route
            exact
            path="/user/:uid/network"
            render={props => <Network {...props} uid={userId} />}
          />
        </main>
        <aside className="dn dib-ns">
          <NavPanel onRight className="bn">
            <Onboarding uid={userId} />
            <p className="tc f6 white ma0">
              Version {process.env.REACT_APP_VERSION}
            </p>
          </NavPanel>
        </aside>
      </div>
    </ContainerHorizontal>
  );
}

Dashboard.propTypes = propTypes;
Dashboard.defaultProps = defaultProps;

const MobileNav = ({ userId }) => {
  const { pathname } = useLocation();
  return (
    <Tabs>
      <TabItem
        data-testid="projectPage"
        to={`/user/${userId}/dashboard`}
        className={`${pathname === `/user/${userId}/dashboard` &&
          'active'}  tracked w-50 tc`}
      >
        <Home className="o-75 h1" /> Projects
      </TabItem>
      <TabItem
        to={`/user/${userId}/network`}
        className={`${pathname === `/user/${userId}/network` &&
          'active'}  tracked w-50 tc`}
        data-testid="networkPage"
      >
        <People className="o-75 h1" /> People
      </TabItem>
    </Tabs>
  );
};

MobileNav.propTypes = { userId: PropTypes.string };
MobileNav.defaultProps = { userId: '' };

function Navigation({ userId }) {
  const { pathname } = useLocation();
  return (
    <>
      <div className="dn-ns">
        <MobileNav userId={userId} />
      </div>
      <NavPanel
        dark
        className="flex-ns dn flex-column justify-between min-vh-100 "
      >
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
        </div>

        <StatsBox userId={userId} />
      </NavPanel>
    </>
  );
}

Navigation.propTypes = { userId: PropTypes.string };
Navigation.defaultProps = { userId: '' };

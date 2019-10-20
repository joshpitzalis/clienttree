import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { doc } from 'rxfire/firestore';
// import { PrivateRoute } from '../features/auth/PrivateRoute';
import { useDispatch } from 'react-redux';
import { createSlice } from 'redux-starter-kit';
import { catchError } from 'rxjs/operators';
import firebase from '../utils/firebase';
import { toast$ } from '../features/notifications/toast';
import { Network } from '../features/network/Network';
import { Profile } from '../features/services/Profile';
import { CRM } from '../features/crm/CRM';
import { ConfettiBanner } from '../features/onboarding/confetti';
import { Onboarding } from '../features/onboarding/ActivityList';
import StatsBox from '../features/stats/StatsBox';
import { Navigation } from './Navigation';

export const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    setProfile(store, action) {
      const { payload } = action;
      return payload;
    },
  },
});

const propTypes = { userId: PropTypes.string };

const defaultProps = { userId: '' };

export function Dashboard({ userId }) {
  const [welcomeMessage, setWelcomeMessage] = React.useState({
    header: 'Welcome!',
    byline: '',
  });
  const dispatch = useDispatch();

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
          dispatch(userSlice.actions.setProfile(user.data()));
        });
      return () => subscription.unsubscribe();
    }
  }, [dispatch, userId]);

  return (
    <div className="flex">
      <ConfettiBanner setWelcomeMessage={setWelcomeMessage} />
      <div className="w-25">
        <Navigation uid={userId} />
        <StatsBox userId={userId} />
      </div>

      <div className="w-50">
        {userId && (
          <Route
            exact
            path="/user/:uid/dashboard"
            render={props => (
              <CRM {...props} welcomeMessage={welcomeMessage} userId={userId} />
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
      <div className="w-25">
        <Onboarding uid={userId} />
      </div>
    </div>
  );
}

Dashboard.propTypes = propTypes;
Dashboard.defaultProps = defaultProps;

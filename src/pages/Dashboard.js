import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Route } from 'react-router-dom';
import { PrivateRoute } from '../features/auth/PrivateRoute';
import { Network } from '../features/network/Network';
import { Profile } from '../features/services/Profile';
import { CRM } from '../features/crm/CRM';
import { ConfettiBanner } from '../features/onboarding/confetti';
import { Onboarding } from '../features/onboarding/GettingStarted';

const propTypes = { userId: PropTypes.string.isRequired };

const defaultProps = {};

export function Dashboard({ userId }) {
  const [submitted, setSubmitted] = React.useState(false);

  const [welcomeMessage, setWelcomeMessage] = React.useState({
    header: 'Welcome!',
    byline: '',
  });

  return (
    <div className="flex">
      <ConfettiBanner setWelcomeMessage={setWelcomeMessage} />
      <div className="w-25">
        <Navigation uid={userId} />
      </div>

      <div className="w-50">
        <Route
          exact
          path="/user/:uid/dashboard"
          render={props => <CRM {...props} welcomeMessage={welcomeMessage} />}
        />
        <Route
          exact
          path="/user/:uid/profile"
          render={props => (
            <Profile
              {...props}
              setSubmitted={setSubmitted}
              submitted={submitted}
            />
          )}
        />
        <Route
          exact
          path="/user/:uid/network"
          render={props => <Network {...props} uid={userId} />}
        />
      </div>
      <div className="w-25">
        <Onboarding submitted={submitted} uid={userId} />
      </div>
    </div>
  );
}

Dashboard.propTypes = propTypes;
Dashboard.defaultProps = defaultProps;

const navigationPropTypes = {
  uid: PropTypes.string.isRequired,
};
const navigationDefaultProps = {};

function Navigation({ uid }) {
  return (
    <ul className="flex-col">
      <li className="list ">
        <NavLink
          activeClassName="b underline"
          to={`/user/${uid}/dashboard`}
          className="f6 link dim mr3 mr4-ns "
        >
          Dashboard
        </NavLink>
      </li>
      <li className="list mt3">
        <NavLink
          to={`/user/${uid}/profile`}
          activeClassName="b underline"
          className="f6 link dim mr3 mr4-ns"
        >
          Services
        </NavLink>
      </li>

      <li className="list mt3">
        <NavLink
          activeClassName="b underline"
          to={`/user/${uid}/network`}
          className="f6 link dim mr3 mr4-ns "
        >
          Outreach
        </NavLink>
      </li>
    </ul>
  );
}

Navigation.propTypes = navigationPropTypes;
Navigation.defaultProps = navigationDefaultProps;

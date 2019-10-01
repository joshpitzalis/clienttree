import React from 'react';
import { NavLink, Route } from 'react-router-dom';
import { PrivateRoute } from '../PrivateRoute';
import { Network } from '../features/network/Network';
import { Profile } from '../features/profile/Profile';
import { CRM } from '../features/crm/CRM';
import { ConfettiBanner } from '../features/onboarding/confetti';
import { Onboarding } from '../features/onboarding/GettingStarted';

export function Dashboard() {
  const [submitted, setSubmitted] = React.useState(false);
  const [welcomeMessage, setWelcomeMessage] = React.useState({
    header: 'Welcome!',
    byline: '',
  });

  return (
    <div className="flex">
      <ConfettiBanner setWelcomeMessage={setWelcomeMessage} />
      <div className="w-25">
        <Navigation />
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
        <PrivateRoute exact path="/user/:uid/network" component={Network} />
      </div>
      <div className="w-25">
        <Onboarding submitted={submitted} />
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <ul className="flex-col">
      <li className="list">
        <NavLink
          to="/user/123/profile"
          activeClassName="b underline"
          className="f6 link dim mr3 mr4-ns"
        >
          Profile
        </NavLink>
      </li>
      <li className="list mt3">
        <NavLink
          activeClassName="b underline"
          to="/user/123/dashboard"
          className="f6 link dim mr3 mr4-ns "
        >
          Dashboard
        </NavLink>
      </li>
      <li className="list mt3">
        <NavLink
          activeClassName="b underline"
          to="/user/123/network"
          className="f6 link dim mr3 mr4-ns "
        >
          Network
        </NavLink>
      </li>
    </ul>
  );
}

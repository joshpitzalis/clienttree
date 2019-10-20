import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const navigationPropTypes = {
  uid: PropTypes.string.isRequired,
};
const navigationDefaultProps = {};
export function Navigation({ uid }) {
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
          data-testid="linkToServices"
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

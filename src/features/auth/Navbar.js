import React from 'react';
import { withRouter, Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import {
  TopBar,
  TopBarSection,
  TopBarTitle,
  Dropdown,
  DropdownItem,
} from '@duik/it';
import Tree from '../../images/Tree';

import { UserContext } from './UserContext';

export const AuthButton = withRouter(({ history }) => {
  const { authStatus, handleLogout } = React.useContext(UserContext);

  return (
    authStatus && (
      <button
        type="button"
        className="link bn pointer"
        onClick={() => handleLogout(history)}
      >
        💥 Sign out
      </button>
    )
  );
});

const propTypes = {};

export const Navbar = withRouter(({ history }) => {
  const { userId, authStatus, handleLogout } = React.useContext(UserContext);

  return (
    <TopBar>
      <TopBarSection>
        <TopBarTitle>
          <Link to={userId ? `/user/${userId}/dashboard` : '/'}>
            <Tree classNames="ml4 pl2 b hover-white no-underline flex items-center pa3" />
          </Link>
        </TopBarTitle>
      </TopBarSection>

      {authStatus && (
        <TopBarSection>
          <TopBarTitle>
            <Dropdown buttonText={<strong>🌳</strong>}>
              <DropdownItem Component={Link} to={`/user/${userId}/profile`}>
                😀 Profile
              </DropdownItem>
              <DropdownItem onClick={() => handleLogout(history)}>
                💥 Sign out
              </DropdownItem>
            </Dropdown>
          </TopBarTitle>
        </TopBarSection>
      )}
    </TopBar>
  );
});

Navbar.propTypes = propTypes;

import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  TopBar,
  TopBarSection,
  TopBarTitle,
  Dropdown,
  DropdownItem,
} from '@duik/it';
import Settings from '../../images/Settings';
import Tree from '../../images/Tree';
import Logout from '../../images/Logout';
import Profile from '../../images/Profile';
import { UserContext } from './UserContext';

// export const AuthButton = withRouter(({ history }) => {
//   const { authStatus, handleLogout } = React.useContext(UserContext);

//   return (
//     authStatus && (
//       <button
//         type="button"
//         className="link bn pointer"
//         onClick={() => handleLogout(history)}
//       >
//         💥 Sign out
//       </button>
//     )
//   );
// });

const DropDownIcon = ({ handleToggle }) => (
  <Settings onClick={handleToggle} className="pointer" />
);
DropDownIcon.propTypes = { handleToggle: PropTypes.func.isRequired };

const propTypes = {};

export const Navbar = withRouter(({ history }) => {
  const { userId, authStatus, handleLogout } = React.useContext(UserContext);

  return (
    <TopBar>
      <TopBarSection>
        <TopBarTitle>
          <Link to={userId ? `/user/${userId}/dashboard` : '/'}>
            <Tree classNames="pa3" />
          </Link>
        </TopBarTitle>
      </TopBarSection>

      {authStatus && (
        <TopBarSection>
          <TopBarTitle>
            <Dropdown
              ButtonComponent={DropDownIcon}
              data-testid="settings"
              buttonProps={{
                clear: true,
                closeOnOptionClick: true,
              }}
            >
              {({ handleClose }) => (
                <div onMouseLeave={handleClose}>
                  <DropdownItem
                    Component={Link}
                    to={`/user/${userId}/profile`}
                    data-testid="goToProfilePage"
                  >
                    <Profile className="" />{' '}
                    <p className="tracked pl2">Profile</p>
                  </DropdownItem>
                  <DropdownItem onClick={() => handleLogout(history)}>
                    <Logout className="" />{' '}
                    <p className="tracked pl2">Logout</p>
                  </DropdownItem>
                </div>
              )}
            </Dropdown>
          </TopBarTitle>
        </TopBarSection>
      )}
    </TopBar>
  );
});

Navbar.propTypes = propTypes;

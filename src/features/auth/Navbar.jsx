import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import {
  TopBar,
  TopBarSection,
  TopBarTitle,
  Dropdown,
  DropdownItem,
} from '@duik/it';
import { OptimizelyFeature } from '@optimizely/react-sdk';

import Tree from '../../images/Tree';
import Logout from '../../images/Logout';
import Profile from '../../images/Profile';
import { UserContext } from './UserContext';

export const Navbar = withRouter(({ history }) => {
  const { userId, authStatus, handleLogout } = React.useContext(UserContext)

  return (
    <TopBar>
      <TopBarSection>
        <TopBarTitle>
          <Link
            to={userId ? `/user/${userId}/network` : '/'}
            data-testid='goToHomePage'
          >
            <Tree classNames='' />
          </Link>
        </TopBarTitle>
      </TopBarSection>

      {authStatus && (
        <TopBarSection>
          <TopBarTitle>
            <OptimizelyFeature feature="referralPage">
              {referralPage => {
                if (referralPage) {
                  return (
                    <Dropdown
                      // ButtonComponent={DropDownIcon}
                      buttonText="Configure your settings"
                      data-testid="settings"
                      buttonProps={{
                        clear: true,
                        closeOnOptionClick: true,
                      }}
                    >
                      {({ handleClose }) => (
                        <div onMouseLeave={handleClose}>
                          <div className="dn db-ns">
                            <DropdownItem
                              Component={Link}
                              to={`/user/${userId}/profile`}
                              data-testid="goToProfilePage"
                            >
                              <Profile className="" />{' '}
                              <p className="tracked pl2">Profile</p>
                            </DropdownItem>
                          </div>
                          <DropdownItem onClick={() => handleLogout(history)}>
                            <Logout className="" />{' '}
                            <p className="tracked pl2">Logout</p>
                          </DropdownItem>
                        </div>
                      )}
                    </Dropdown>
                  );
                }
                return (
                  <button
                    className="bn pointer grow"
                    type="button"
                    onClick={() => handleLogout(history)}
                  >
                    <p className="tracked">Logout</p>
                  </button>
                );
              }}
            </OptimizelyFeature>
          </TopBarTitle>
        </TopBarSection>
      )}
    </TopBar>
<<<<<<< HEAD
  )
})

Navbar.propTypes = propTypes
=======
  );
});
>>>>>>> master

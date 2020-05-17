import React from 'react'
import { Navbar } from './features/auth/Navbar'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import Refer from './features/profile/Referral'
import { UserContext } from './features/auth/UserContext'
import Banner from './features/notifications/toast'
import { NetworkProvider } from './features/people/NetworkContext'
import ErrorBoundary from './utils/ErrorBoundary'
import {
  createInstance,
  OptimizelyProvider
} from '@optimizely/react-sdk'
import { BrowserRouter, Route } from 'react-router-dom'
import 'tachyons'

const propTypes = {
  // location: ReactRouterPropTypes.location.isRequired,
}

const optimizely = createInstance({
  sdkKey: process.env.REACT_APP_ROLLOUT
})

const App = () => {
  const { authStatus, userId } = React.useContext(UserContext)

  return (
    <OptimizelyProvider
      optimizely={optimizely}
      user={{
        id: userId,
        attributes: {
          id: userId
        }
      }}
    >
      <ErrorBoundary>
        <BrowserRouter>
          <div>
            <Navbar authStatus={authStatus} />
            <Banner />
            <main>
              <Route
                exact
                path='/'
                render={routeProps => (
                  <Login
                    {...routeProps}
                    authStatus={authStatus}
                    userId={userId}
                  />
                )}
              />
              <Route
                exact
                path='/login'
                render={loginProps => (
                  <Login
                    {...loginProps}
                    authStatus={authStatus}
                    userId={userId}
                  />
                )}
              />
              {userId && (
                <NetworkProvider uid={userId}>
                  <Route
                    path='/user/:uid'
                    render={dashProps => (
                      <Dashboard
                        {...dashProps}
                        userId={userId}
                        authStatus={authStatus}
                      />
                    )}
                  />
                </NetworkProvider>
              )}
              <Route
                exact
                path='/refer/:uid'
                render={referProps => <Refer {...referProps} userId={userId} />}
              />
            </main>
          </div>
          {/* <Footer /> */}
        </BrowserRouter>
      </ErrorBoundary>
    </OptimizelyProvider>
  )
}

export default App

App.propTypes = propTypes

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
          <Footer />
        </BrowserRouter>
      </ErrorBoundary>
    </OptimizelyProvider>
  )
}

export default App

App.propTypes = propTypes

const Footer = () => <div className="bg-white">
  <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
    <div className="flex justify-center md:order-2">

      <a href="https://twitter.com/joshpitzalis" target="_blank" rel="noreferrer noopener" className="ml-6 text-gray-400 hover:text-gray-500">
        <span className="sr-only">Twitter</span>
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      </a>

    </div>
    <div className="mt-8 md:mt-0 md:order-1">
      <p className="text-center text-base leading-6 text-gray-400">
      &copy; 2020 Client Tree, Inc. All rights reserved.
      </p>
    </div>
  </div>
</div>

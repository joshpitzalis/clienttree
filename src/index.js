import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'
import Routes from './Routes'
import { UserProvider } from './features/auth/UserContext'
import store from './utils/store'
import '@duik/it/dist/styles.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import 'tachyons'
import './tailwind.generated.css'
import {
  RecoilRoot
} from 'recoil'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    release: process.env.REACT_APP_VERSION
  })
} else {
  const config = {
    rules: [{ id: 'radiogroup', enabled: true }]
  }
  // eslint-disable-next-line
  var axe = require("react-axe");
  axe(React, ReactDOM, 1000, config)
}
console.log({ Version: process.env.REACT_APP_VERSION })

const App = () => (
  <RecoilRoot>
    <Provider store={store}>
      <UserProvider>
        <Routes />
      </UserProvider>
    </Provider>
  </RecoilRoot>
)

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

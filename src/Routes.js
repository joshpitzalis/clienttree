import React from 'react';
import 'tachyons';
import { BrowserRouter, Route } from 'react-router-dom';
import Banner from './features/notifications/toast';
import { Navbar } from './features/auth/Navbar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { PrivateRoute } from './PrivateRoute';

const App = () => (
  <BrowserRouter>
    <main>
      <Banner />
      <Navbar />
      <Route exact path="/" component={Login} />
      <Route exact path="/login" component={Login} />
      <PrivateRoute path="/user/:uid" component={Dashboard} />
    </main>
  </BrowserRouter>
);

export default App;

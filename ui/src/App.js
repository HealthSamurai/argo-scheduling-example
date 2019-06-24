import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';

import Header from './components/Header';

import PrivateRoute from './components/PrivateRoute';
import Auth, { Logout } from './components/Auth';
import Appointment from './components/Appointment';
import NewAppointment from './components/NewAppointment';

const { Content, Footer } = Layout;

const NotFound = () => <div>Page not found</div>;

const App = () => (
  <Layout>
    <Header />
    <Content style={{ padding: '0 50px' }}>
      <div
        style={{
          background: '#fff',
          padding: 24,
          minHeight: 380,
          marginTop: '16px'
        }}
      >
        <Switch>
          <PrivateRoute path="/" exact component={Appointment} />
          <PrivateRoute
            path="/appointment/new"
            exact
            component={NewAppointment}
          />
          <Route path="/auth" component={Auth} />
          <Route path="/logout" component={Logout} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer style={{ textAlign: 'center' }} />
    </Content>
  </Layout>
);

export default App;

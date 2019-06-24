import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import StoreContext from 'storeon/react/context';
import { createBrowserHistory } from 'history';

import store from './store';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

export const history = createBrowserHistory({});

const render = Component => {
  ReactDOM.render(
    <StoreContext.Provider value={store}>
      <Router history={history}>
        <Component />
      </Router>
    </StoreContext.Provider>,
    document.getElementById('root')
  );
};

render(App);
// eslint-disable-next-line
if (module.hot) {
  // eslint-disable-next-line
  module.hot.accept('./App', () => {
    // eslint-disable-next-line
    const NextApp = require('./App').default;
    render(NextApp);
  });
}

serviceWorker.unregister();

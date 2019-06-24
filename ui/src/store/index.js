import createStore from 'storeon';

import user from './user';
import appointment from './appointment';

const store = createStore([
  user,
  appointment,
  process.env.NODE_ENV !== 'production' && require('storeon/devtools')
]);

export default store;

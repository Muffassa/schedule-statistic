// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import data from './data';

const rootReducer = combineReducers({
  data,
  router,
});

export default rootReducer;

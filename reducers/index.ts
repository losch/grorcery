import { combineReducers } from 'redux';

import groceries from './groceries';
import catalog from './catalog';

const rootReducer = combineReducers({
  groceries: groceries,
  catalog: catalog
});

export default rootReducer;
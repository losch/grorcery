/// <reference path='../typings/tsd.d.ts'/>

import './main.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router';
import { createHistory } from 'history';

import { Store,
         compose,
         createStore,
         bindActionCreators,
         combineReducers } from 'redux';
import { connect,
         Provider } from 'react-redux';

import rootReducer from '../reducers';

import CatalogView from '../containers/CatalogView';
import GroceryListView from '../containers/GroceryListView';

const initialState = {};

const store: Store = createStore(rootReducer, initialState);

ReactDOM.render(
  <Provider store={store}>
    <Router history={createHistory()}>
      <Route path='/' component={CatalogView} />
      <Route path='/grocerylist/:id' component={GroceryListView} />
    </Router>
  </Provider>,
  document.getElementById('app')
);

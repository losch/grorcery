import objectAssign = require('object-assign');

import { GROCERY_LIST_CREATED,
         GROCERY_LIST_DELETED } from './ActionTypes';

function createGroceryList(dispatch: any, title: string): void {
  dispatch(
    {
      type: GROCERY_LIST_CREATED,
      id: parseInt((Math.random() * 10000).toFixed(0)),
      title: title
    }
  )
}

function deleteGroceryList(dispatch: any, id: number): void {
  dispatch(
    {
      type: GROCERY_LIST_DELETED,
      id: id
    }
  );
}

export {
  createGroceryList,
  deleteGroceryList
}

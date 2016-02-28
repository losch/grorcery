import { CHANGE_TEXT,
         GROCERY_LIST_RECEIVED,
         GROCERY_ITEM_CREATED,
         GROCERY_ITEM_DELETED,
         GROCERY_ITEM_CHECKED,
         GROCERY_ITEM_RENAMED,
         GROCERY_ITEM_MOVED,
         GROCERY_LIST_RENAMED } from './ActionTypes';

import objectAssign = require('object-assign');

const testData = {
  id: 0,
  title: 'Test list',
  groceries: [
    {
      id: 0,
      title: 'Eggs',
      isChecked: false
    },
    {
      id: 1,
      title: 'Ham',
      isChecked: true
    },
    {
      id: 2,
      title: 'Bacon',
      isChecked: false
    },
    {
      id: 3,
      title: 'More eggs',
      isChecked: false
    },
    {
      id: 4,
      title: 'More ham',
      isChecked: false
    },
    {
      id: 5,
      title: 'More bacon',
      isChecked: true
    }
  ]
};

function fetchGroceryList(dispatch: any, id: number): void {
  console.log("Setting timeout");
  setTimeout(() => {
    console.log("Dispatching");
    dispatch(
      {
        type: GROCERY_LIST_RECEIVED,
        groceryList: objectAssign({}, testData, {
          id: id,
          title: 'Ostoslista #' + id
        })
      })
  }, 150);
}

function createGroceryItem(dispatch: any, title: string): void {
  dispatch(
    {
      type: GROCERY_ITEM_CREATED,
      id: parseInt((Math.random() * 10000).toFixed(0)),
      title: title
    }
  );
}

function deleteGroceryItem(dispatch: any, id: number): void {
  dispatch(
    {
      type: GROCERY_ITEM_DELETED,
      id: id
    }
  );
}

function toggleGroceryItemCheck(dispatch: any,
                                id: number,
                                isChecked: boolean): void {
  dispatch(
    {
      type: GROCERY_ITEM_CHECKED,
      id: id,
      isChecked: isChecked
    }
  );
}

function renameGroceryItem(dispatch: any,
                           id: number,
                           title: string): void {
  dispatch(
    {
      type: GROCERY_ITEM_RENAMED,
      id: id,
      title: title
    }
  );
}

function moveGroceryItem(dispatch: any,
                         id: number,
                         index: number,
                         isAppend: boolean): void {
  dispatch(
    {
      type: GROCERY_ITEM_MOVED,
      id: id,
      index: index,
      isAppend: isAppend
    }
  );
}

function renameGroceryList(dispatch: any, id: number, title: string): void {
  dispatch(
    {
      type: GROCERY_LIST_RENAMED,
      id: id,
      title: title
    }
  );
}

export {
  fetchGroceryList,
  createGroceryItem,
  deleteGroceryItem,
  toggleGroceryItemCheck,
  renameGroceryItem,
  moveGroceryItem,
  renameGroceryList
};

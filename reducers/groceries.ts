import * as _ from 'lodash';
import objectAssign = require('object-assign');

import { GROCERY_LIST_RECEIVED,
         GROCERY_LIST_RENAMED,
         GROCERY_ITEM_CREATED,
         GROCERY_ITEM_DELETED,
         GROCERY_ITEM_CHECKED,
         GROCERY_ITEM_RENAMED,
         GROCERY_ITEM_MOVED,
         Action } from '../actions/ActionTypes';
import { GroceryListReceivedAction,
         GroceryListRenameAction,
         GroceryItemCreatedAction,
         GroceryItemDeletedAction,
         GroceryItemCheckAction,
         GroceryItemRenameAction,
         GroceryItemMovedAction } from "../actions/ActionTypes";
import { GroceryListModel, GroceryModel } from '../models';

const testData = {
  id: -1,
  title: '',
  groceries: []
};

/**
 * Creates new grocery item to grocery list
 * @param groceryList - Grocery list to modify
 * @param id - New grocery item's ID
 * @param title - New grocery item's title
 * @returns New grocery list
 */
function createItem(groceryList: GroceryListModel,
                    id: number,
                    title: string): GroceryListModel {
  let newGrocery: GroceryModel = {
    id: id,
    title: title,
    isChecked: false
  };

  let newGroceries = groceryList.groceries.concat(newGrocery);
  return objectAssign({}, groceryList, { groceries: newGroceries });
}

/**
 * Deletes a grocery item from grocery list
 * @param groceryList - Grocery list
 * @param id - Item's ID
 * @returns New grocery list
 */
function deleteItem(groceryList: GroceryListModel,
                    id: number): GroceryListModel {
  const newGroceryList = groceryList.groceries.filter(
    (grocery: GroceryModel) => grocery.id !== id
  );
  return objectAssign({}, groceryList, { groceries: newGroceryList });
}

/**
 * Returns a new edited grocery list
 * @param groceryList - Grocery list to modify
 * @param id - Edited grocery's ID
 * @param edit - Function that performs grocery editing
 * @returns New grocery list
 */
function editGrocery(groceryList: GroceryListModel,
                     id: number,
                     edit: (GroceryModel) => GroceryModel): GroceryListModel {
  var newGroceries =
    _.map(groceryList.groceries,
          grocery => grocery.id === id ?
                     objectAssign({}, edit(grocery)) :
                     grocery);

  return objectAssign({}, groceryList, { groceries: newGroceries });
}

/**
 * Toggles whether grocery item is checked or not
 * @param groceryList - Grocery list to modify
 * @param id - Grocery's ID
 * @param isChecked - Is grocery checked?
 * @returns New grocery list
 */
var toggleCheck = (groceryList: GroceryListModel,
                   id: number,
                   isChecked: boolean): GroceryListModel =>
  editGrocery(groceryList,
              id,
              (grocery) => objectAssign({}, grocery, { isChecked: isChecked }));

/**
 * Rename's grocery item
 * @param groceryList - Grocery list to modify
 * @param id - Grocery's ID
 * @param title - New title for grocery item
 * @returns New grocery list
 */
var renameItem = (groceryList: GroceryListModel,
                  id: number,
                  title: string): GroceryListModel =>
  editGrocery(groceryList,
              id,
              (grocery) => objectAssign({}, grocery, { title: title }));


function findGroceryItem(groceryList: GroceryListModel,
                         id: number): GroceryModel {
  for (let i = 0; i < groceryList.groceries.length; i++) {
    var grocery = groceryList.groceries[i];
    if (grocery.id === id) {
      return grocery;
    }
  }
  return null;
}

/**
 * Moves item in grocery list to a new index
 * @param groceryList - Grocery list to modify
 * @param id - Grocery item's ID
 * @param index - Index where to move the item
 * @param isAppend - Should the item be appended instead of inserted?
 * @returns New grocery list
 */
function moveItem(groceryList: GroceryListModel,
                  id: number,
                  index: number,
                  isAppend: boolean) {
  let newGroceries: GroceryModel[] = [];

  if (isAppend) index += 1;

  let movedGrocery = findGroceryItem(groceryList, id);

  for (let i = 0; i < groceryList.groceries.length; i++) {
    let grocery = groceryList.groceries[i];

    if (i === index) {
      newGroceries.push(movedGrocery);
    }

    if (grocery.id !== id) {
      newGroceries.push(grocery);
    }
  }

  if (isAppend && index >= groceryList.groceries.length) {
    newGroceries.push(movedGrocery);
  }

  return objectAssign({}, groceryList, { groceries: newGroceries });
}

/**
 * Handles catalog item renaming
 * @param state
 * @param id
 * @param title
 * @returns {GroceryListModel}
 */
function renameCatalog(state: GroceryListModel,
                       id: Number,
                       title: String): GroceryListModel {
  return state.id == id ?
         objectAssign({}, state, {title: title}) :
         state;
}

/**
 * Groceries reducer
 * @param state - Initial state
 * @param action - Received action
 * @returns {GroceryListModel}
 */
export default function groceries(state: GroceryListModel = testData,
                                  action: Action) {
  switch (action.type) {
    case GROCERY_LIST_RECEIVED:
      let listReceivedAction = <GroceryListReceivedAction> action;
      return listReceivedAction.groceryList;

    case GROCERY_ITEM_CREATED:
      let createAction = <GroceryItemCreatedAction> action;
      return createItem(state, createAction.id, createAction.title);

    case GROCERY_ITEM_DELETED:
      let deleteAction = <GroceryItemDeletedAction> action;
      return deleteItem(state, deleteAction.id);

    case GROCERY_ITEM_CHECKED:
      let checkAction = <GroceryItemCheckAction> action;
      return toggleCheck(state, checkAction.id, checkAction.isChecked);

    case GROCERY_ITEM_RENAMED:
      let renameAction = <GroceryItemRenameAction> action;
      return renameItem(state, renameAction.id, renameAction.title);

    case GROCERY_ITEM_MOVED:
      let moveAction = <GroceryItemMovedAction> action;
      return moveItem(state,
                      moveAction.id,
                      moveAction.index,
                      moveAction.isAppend);

    case GROCERY_LIST_RENAMED:
      let catalogRenameAction = <GroceryListRenameAction> action;
      return renameCatalog(state,
                           catalogRenameAction.id,
                           catalogRenameAction.title);

    default:
      return state;
  }
};

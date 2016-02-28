import { GroceryListModel } from '../models';

export const CHANGE_TEXT = 'CHANGE_TEXT';

export const CATALOG_RECEIVED = 'CATALOG_RECEIVED';

export const GROCERY_LIST_CREATED = 'GROCERY_LIST_CREATED';
export const GROCERY_LIST_DELETED = 'GROCERY_LIST_DELETED';
export const GROCERY_LIST_RENAMED = 'GROCERY_LIST_RENAMED';
export const GROCERY_LIST_RECEIVED = 'GROCERY_LIST_RECEIVED';

export const GROCERY_ITEM_CHECKED = 'GROCERY_ITEM_CHECKED';
export const GROCERY_ITEM_RENAMED = 'GROCERY_ITEM_RENAMED';
export const GROCERY_ITEM_CREATED = 'GROCERY_ITEM_CREATED';
export const GROCERY_ITEM_DELETED = 'GROCERY_ITEM_DELETED';
export const GROCERY_ITEM_MOVED = 'GROCERY_ITEM_MOVED';

export interface Action {
  type: string
}

//
// Catalog actions
//

export interface CatalogReceivedAction extends Action {
  // TODO
}

//
// Grocery list actions
//

export interface GroceryListReceivedAction extends Action {
  groceryList: GroceryListModel;
}

//
// Grocery item actions
//

export interface GroceryItemCheckAction extends Action {
  id: number,
  isChecked: boolean
}

export interface GroceryItemRenameAction extends Action {
  id: number,
  title: string
}

export interface GroceryItemCreatedAction extends Action {
  id: number,
  title: string
}

export interface GroceryItemDeletedAction extends Action {
  id: number
}

export interface GroceryItemMovedAction extends Action {
  id: number,
  index: number,
  isAppend: boolean
}

//
// Grocery list actions
//

export interface GroceryListCreateAction extends Action {
  id: number,
  title: string
}

export interface GroceryListDeleteAction extends Action {
  id: number
}

export interface GroceryListRenameAction extends Action {
  id: number,
  title: string
}

import objectAssign = require("object-assign");

import { Action } from '../actions/ActionTypes';
import { GROCERY_LIST_CREATED,
         GROCERY_LIST_DELETED,
         GROCERY_LIST_RENAMED,
         GroceryListDeleteAction,
         GroceryListCreateAction,
         GroceryListRenameAction } from "../actions/ActionTypes";
import { CatalogItemModel } from '../models';

const testData: CatalogItemModel[] = [
  {
    id: 0,
    title: "Shopping list #0",
    createdOn: new Date(),
    createdBy: 'Eggs',
    modifiedOn: new Date(),
    modifiedBy: 'Ham'
  },
  {
    id: 1,
    title: "Shopping list #1",
    createdOn: new Date(),
    createdBy: 'Ham'
  },
  {
    id: 3,
    title: "Shopping list #2"
  },
  {
    id: 4,
    title: "Shopping list #3"
  }
];

function createCatalog(list: CatalogItemModel[],
                       id: number,
                       title: string): CatalogItemModel[] {
  return list.concat({
    id: id,
    title: title
  });
}

function deleteCatalog(list: CatalogItemModel[],
                       id: number): CatalogItemModel[] {
  return list.filter((item: CatalogItemModel) => item.id !== id);
}

function renameCatalog(list: CatalogItemModel[],
                       id: number,
                       title: string): CatalogItemModel[] {
  return list.map((item: CatalogItemModel) =>
    item.id == id ?
      objectAssign({}, item, { title: title }) :
      item);
}

export default function catalog(state: Array<CatalogItemModel> = testData,
                                action: Action) {
  switch (action.type) {
    case GROCERY_LIST_CREATED:
      let createAction = <GroceryListCreateAction> action;
      return createCatalog(state, createAction.id, createAction.title);

    case GROCERY_LIST_DELETED:
      let deleteAction = <GroceryListDeleteAction> action;
      return deleteCatalog(state, deleteAction.id);

    case GROCERY_LIST_RENAMED:
      let renameAction = <GroceryListRenameAction> action;
      return renameCatalog(state, renameAction.id, renameAction.title);

    default:
      return state;
  }
};

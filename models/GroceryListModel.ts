import { GroceryModel } from './GroceryModel';

export interface GroceryListModel {
  id: number;
  title: string;
  groceries: Array<GroceryModel>;
  createdOn?: Date;
  createdBy?: string;
  modifiedOn?: Date;
  modifiedBy?: string;
}
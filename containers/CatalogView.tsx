import './CatalogView.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createGroceryList,
         deleteGroceryList } from '../actions/catalog';

import { CatalogItemModel, GroceryListModel } from '../models';
import Button from '../components/Button';
import Header from '../components/Header';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as PromptModal from '../components/PromptModal';
import * as ConfirmModal from '../components/ConfirmModal';

import * as DateUtils from '../common/DateUtils';

interface CatalogItemProps {
  key?: string;
  onDeleteGroceryList: (id) => void;
  catalogItem: CatalogItemModel;
}

class CatalogItem extends React.Component<CatalogItemProps, void> {
  private historyText(prefix: string, author: string, date: Date): string {
    const nonEmpty = (str) => str && str.length > 0;

    let onStr = DateUtils.yyyymmdd(date);
    let list = [];

    if (nonEmpty(author) && nonEmpty(onStr)) {
      list = [prefix, author, 'on', onStr];
    }
    else if (nonEmpty(author)) {
      list = [prefix, author];
    }

    return list.join(" ");
  }

  private renderHeader(catalogItem: CatalogItemModel): React.ReactElement<any> {
    return (
      <div className="grocery-item-title">
        <div className="grocery-item-subtitle">{
          this.historyText("Created by",
                           catalogItem.createdBy,
                           catalogItem.createdOn)
          }</div>
        <div className="grocery-item-subtitle">{
          this.historyText("Modified by",
                           catalogItem.modifiedBy,
                           catalogItem.modifiedOn)
          }</div>
      </div>
    );
  }

  render() {
    const { catalogItem, onDeleteGroceryList, key } = this.props;

    return (
      <div className="one-half column grocery-catalog-item"
           key={key}>
        <Button className="grocery-item-button"
                onClick={() => onDeleteGroceryList(catalogItem.id)}>
          Delete
        </Button>
        <div className="grocery-item-info">
          <Link className="grocery-item-link"
                to={`/grocerylist/${catalogItem.id}`}>{
            catalogItem.title
            }</Link>
          { this.renderHeader(catalogItem) }
        </div>
      </div>
    );
  }
}

class CatalogView extends React.Component<any, void> {
  private getGroceryListTitle(id: number): string {
    let groceryList= this.props.catalog.find(
      (catalogItem: CatalogItemModel) =>
      catalogItem.id == id
    );
    return groceryList ? groceryList.title : '';
  }


  createGroceryList() {
    const okAction = (title) => {
      if (title) {
        createGroceryList(this.props.dispatch, title);
      }
    };

    PromptModal.create(
      'Name for new grocery list',
      'Insert name',
      [ { name: 'Ok', key: 'Enter', action: okAction },
        { name: 'Cancel', key: 'Escape' } ]);
  }

  deleteGroceryList(id: number) {
    const title = this.getGroceryListTitle(id);

    let okAction = () => {
      deleteGroceryList(this.props.dispatch, id);
    };

    ConfirmModal.create("Delete " + title + "?", okAction);
  }

  private groupList(list: Array<GroceryListModel>):
          Array<Array<GroceryListModel>> {
      let groupedList = [];
      let index = 0;

      list.forEach((groceryList: GroceryListModel, i: number) => {
        if ((i + 1) % 2 !== 0) index++;
        if (groupedList[index]) groupedList[index].push(groceryList);
        else groupedList[index] = [groceryList];
      });

      return groupedList;
  }

  render() {
    const { catalog } = this.props;

    return (
      <div className="container grocery-catalog">
        <div className="row">
          <div className="twelve columns">
            <Header><h1>Grocery list catalog</h1></Header>
          </div>
        </div>
        <div className="grocery-catalog-items">
          {
            this.groupList(catalog)
                .map((lists: Array<CatalogItemModel>, i: number) =>
              <div className="row">
                {
                  lists.map((catalogItem: CatalogItemModel, j: number) =>
                    <CatalogItem key={'grocery-list-' + i + '-' + j}
                                 catalogItem={catalogItem}
                                 onDeleteGroceryList={
                                    (id) => this.deleteGroceryList(id)} />
                  )
                }
              </div>
            )
          }
        </div>
        <div className="row">
          <Button onClick={() => this.createGroceryList()}>
            New grocery list
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  catalog: state.catalog
});

export default connect(mapStateToProps)(CatalogView);

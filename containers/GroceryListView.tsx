import './GroceryListView.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { fetchGroceryList,
         renameGroceryList,
         createGroceryItem,
         deleteGroceryItem,
         toggleGroceryItemCheck,
         renameGroceryItem,
         moveGroceryItem } from '../actions/groceries';
import Button from '../components/Button';
import Header from '../components/Header';
import GroceryList from '../components/GroceryList';
import * as PromptModal from '../components/PromptModal';
import {connect} from 'react-redux';

interface GroceryListViewProps {}

interface GroceryListViewState {
  // Is fetching grocery list ongoing?
  isFetchingList: Boolean;
}

class CatalogButton extends React.Component<any, any> {
  render() {
    return (
      <Button
        onClick={ () => this.props.onClick() }>Back to catalog</Button>
    );
  }
}

class GroceryListView extends React.Component<any, GroceryListViewState> {
  constructor(props) {
    super(props);
    this.state = {
      isFetchingList: false
    }
  }

  loadGroceryList(id: number) {
    // Kick the fetch action
    fetchGroceryList(this.props.dispatch, id);
  }

  checkGroceryList(props) {
    console.log(props);

    const { params, groceries } = props;
    const id = parseInt(params.id);

    if (groceries.id !== id) {
      console.log("fetch");
      this.setState({
        isFetchingList: true
      });
      this.loadGroceryList(id);
    }
    else {
      console.log("no fetch");
      this.setState({
        isFetchingList: false
      });
    }
  }

  componentWillMount() {
    this.checkGroceryList(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkGroceryList(nextProps);
  }

  gotoCatalog() {
    this.props.history.pushState('/');
  }

  createGrocery(title: string) {
    createGroceryItem(this.props.dispatch, title);
  }

  deleteGrocery(id: number) {
    deleteGroceryItem(this.props.dispatch, id);
  }

  toggleGrocery(id: number, isChecked: boolean) {
    toggleGroceryItemCheck(this.props.dispatch, id, isChecked);
  }

  renameGrocery(id: number, title: string) {
    renameGroceryItem(this.props.dispatch, id, title)
  }

  moveGrocery(id: number, index: number, isAppend: boolean) {
    moveGroceryItem(this.props.dispatch, id, index, isAppend);
  }

  renameCatalog() {
    let handleRename = (title) => {
      if (title != undefined) {
        renameGroceryList(this.props.dispatch, this.props.params.id, title);
      }
    };

    PromptModal.create(
      'Rename grocery list',
      'Insert new title',
      [ { name: 'Ok', key: 'Enter', action: handleRename },
        { name: 'Cancel', key: 'Escape' } ],
      this.props.groceries.title);
  }

  render() {
    const { groceries, catalog, dispatch, params } = this.props;

    return (
        this.state.isFetchingList ?
          <div className="container">
            <div className="row">
              <div>Fetching grocery list...</div>
            </div>
            <div className="row">
              <CatalogButton onClick={() => this.gotoCatalog()} />
            </div>
          </div> :
          <div className="container">
            <div className="row">
              <Header>
                <h1 onClick={() => this.renameCatalog()}>
                  {groceries.title}
                </h1>
              </Header>
            </div>
            <div className="row">
              <CatalogButton onClick={() => this.gotoCatalog()} />
              <GroceryList
                onCreate={(title) => this.createGrocery(title)}
                onDelete={(id) => this.deleteGrocery(id)}
                onToggle={(id, isChecked) => this.toggleGrocery(id, isChecked)}
                onRename={(id, title) => this.renameGrocery(id, title)}
                moveGroceryItem={(id, index, isAppend) =>
                                    this.moveGrocery(id, index, isAppend)}
                {...groceries} />
            </div>
          </div>
    );
  }
}

const mapStateToProps = state => ({
  groceries: state.groceries
});

export default connect(mapStateToProps)(GroceryListView);

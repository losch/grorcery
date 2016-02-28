import './GroceryList.scss';

import * as _ from 'lodash';
import * as React from 'react';
import * as Classnames from 'classnames';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import { DragDropContext, DragSource, DropTarget, DragLayer } from 'react-dnd';
import objectAssign = require("object-assign");

import { GroceryModel, GroceryListModel } from '../models';
import * as ReactDOM from 'react-dom';
import { GROCERY_ITEM } from '../constants/ItemTypes';
import * as PromptModal from './PromptModal';

const MOUSE_DOUBLE_CLICK_WINDOW = 250; // ms
const LONG_TOUCH_DELAY = 500; // ms

var groceryItemSource = {
  beginDrag: function (props) {
    return {
      id: props.id,
      index: props.index
    };
  }
};

const groceryItemTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = ReactDOM.findDOMNode(component)
                                      .getBoundingClientRect();

    // Vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    const clientOffset = monitor.getClientOffset();

    // Pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    props.moveItem(monitor.getItem().id, hoverIndex, dragIndex < hoverIndex);
    monitor.getItem().index = hoverIndex;
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getClientOffset()
  };
}

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isSiblingDragged: monitor.isOver()
  };
}

function getItemStyles(currentOffset): any {
  if (!currentOffset) {
    return {
      display: 'none'
    }
  }
  else {
    var x = currentOffset.x;
    var y = currentOffset.y;
    var transform = `translate(${x}px, ${y}px)`;

    return {
      position: 'fixed',
      left: 0,
      top: 0,
      pointerEvents: 'none',
      transform: transform,
      WebkitTransform: transform
    };
  }
}

interface GroceryItemProps extends GroceryModel {
  key?: string;
  index: number;
  onToggle: (id: number) => void;
  onRename: (id: number, title: string) => void;
  isDragging: boolean;
  isSiblingDragged: boolean;
  connectDragSource: (any) => any;
  connectDragPreview: (any) => any;
  connectDropTarget: (any) => any;
  currentOffset: any;
  moveItem: (dragIndex: number, dropIndex: number, isAppend: boolean) => any;
  style: any;
}

class _GroceryItem extends React.Component<GroceryItemProps, any> {
  clicks: number;
  onHandleClick: () => void;
  isNextClick: boolean;
  timer: any;

  constructor(props) {
    super(props);
    this.clicks = 0;
    this.onHandleClick = _.debounce(
      () => {
        if (this.clicks > 1) this.onDoubleClick();
        else if (this.clicks === 1) this.onSingleClick();

        this.clicks = 0;
      },
      MOUSE_DOUBLE_CLICK_WINDOW
    );

    this.isNextClick = true;
  }

  onTouchStart(e) {}

  onTouchEnd(e) {
    clearTimeout(this.timer);
  }

  onDragStart(e) {
    console.log("On drag start");
    this.preventNextClick(e);
    clearTimeout(this.timer);
  }

  onClick(e) {
    if (this.isNextClick) {
      console.log("CLICK");
      this.clicks++;
      this.onHandleClick();
    }
    else {
      console.log("NO CLICK");
      this.isNextClick = true;
    }
  }

  onSingleClick() {
    console.log("**** single click");
    this.props.onToggle(this.props.id);
  }

  onDoubleClick() {
    this.edit();
  }

  edit() {
    let handleRename = (title) => {
      if (title != undefined) {
        this.props.onRename(this.props.id, title);
      }
    };

    let handleDelete = () => {
      this.props.onRename(this.props.id, '');
    };

    PromptModal.create(
      "Edit grocery item",
      "Insert title",
      [ { name: 'Ok', key: 'Enter', action: handleRename },
        { name: 'Cancel', key: 'Escape' },
        { name: 'Delete', action: handleDelete } ],
      this.props.title
    );
  }

  onLongTouch() {
    this.clicks = 0;
    console.log("**** on long touch");
    this.onDoubleClick();
  }

  preventNextClick(e) {
    this.isNextClick = false;
  }

  render() {
    const { title, isChecked, isDragging } = this.props;
    const className = Classnames(
      'grocery-list-item',
      'no-selection',
      {
        'is-checked': isChecked,
        'is-dragged': isDragging,
        'no-hover': this.props.isSiblingDragged || this.props.isDragging,
      }
    );

    const handle = this.props.connectDragSource(
      <div className="grocery-list-item-handle">
        <i className="fa fa-arrows-v" />
      </div>
    );

    let previewItem;

    if (isDragging) {
      const previewClassName = Classnames(className, 'preview');
      previewItem =
        <div className={previewClassName}
             style={getItemStyles(this.props.currentOffset)}>
          {title}
        </div>;
    }

    return this.props.connectDropTarget(
      <li className={className}
          onTouchStart={(e) => this.onTouchStart(e)}
          onTouchEnd={(e) => this.onTouchEnd(e)}
          onDragStart={(e) => this.onDragStart(e)}
          onClickCapture={(e) => this.onClick(e)}>
        {title}{handle}
        {previewItem}
      </li>
    );
  }
}

const GroceryItem =
  DropTarget(GROCERY_ITEM, groceryItemTarget, collectTarget)(
    DragSource(GROCERY_ITEM, groceryItemSource, collect)(_GroceryItem));

interface GroceryListProps extends GroceryListModel {
  onToggle: (id: number, isChecked: boolean) => void
  onRename: (id: number, title: string) => void
  onCreate: (title: string) => void
  onDelete: (id: number) => void
  moveGroceryItem: (id: number, index: number, isAppend: boolean) => void
}

class GroceryList extends React.Component<GroceryListProps, any> {
  refs: any;

  onToggle(id: number) {
    const { groceries, onToggle } = this.props;
    const grocery = _.find(groceries, grocery => grocery.id == id);
    if (grocery) {
      onToggle(id, !grocery.isChecked)
    }
  }

  onRename(id: number, title: string): void {
    if (title.trim() === '') {
      this.props.onDelete(id)
    }
    else {
      this.props.onRename(id, title)
    }
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      this.createNewItem(e);
    }
  }

  createNewItem(e) {
    const input = this.refs.newItem;
    const value = input.value.trim();
    if (value) {
      this.props.onCreate(value);
      input.value = '';
    }
  }

  moveItem(id, index, isAppend) {
    this.props.moveGroceryItem(id, index, isAppend);
  }

  render() {
    const { groceries } = this.props;

    return (
      <div className='grocery-list'>
        <ul ref='groceryContainer' className='grocery-list-items'>
          {
            groceries.map((grocery, index) =>
              <GroceryItem
                key={'grocery-' + grocery.id}
                index={index}
                onToggle={(id: number) => this.onToggle(id)}
                onRename={(id: number, title: string) =>
                            this.onRename(id, title)}
                moveItem={(dragIndex, dropIndex, isAppend) =>
                            this.moveItem(dragIndex, dropIndex, isAppend)}
                {...grocery} />)
          }
        </ul>
        <div className="grocery-list-new-item">
          <input ref="newItem"
                 className="grocery-list-new-item-input"
                 type="text"
                 placeholder="New grocery"
                 onKeyPress={(e) => this.onKeyPress(e)} />
          <button className="grocery-list-new-item-button"
                  onClick={(e) => this.createNewItem(e)}>OK</button>
        </div>
      </div>
    );
  }
}

export default DragDropContext<any>(
  TouchBackend({ enableMouseEvents: true }))(GroceryList);

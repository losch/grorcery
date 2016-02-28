import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Classnames from 'classnames';
import * as Modal from './Modal';

interface ModalAction {
  name: string;
  key?: string;
  action?: (value) => void;
}

export function create(title: string,
                       placeholder: string,
                       actions: ModalAction[],
                       defaultValue?: string) {
  let inputRef;

  const onAction = (name) => {
    let value = inputRef.value;

    let modalAction = _.find(actions, (action) => action.name == name);
    if (modalAction && modalAction.action) {
      modalAction.action(value);
    }

    Modal.closeModal();
  };

  const onKeyPress = (e) => {
    let modalAction = _.find(actions, (action) => action.key == e.key);
    if (modalAction && modalAction.name) {
      onAction(modalAction.name);
    }
  };

  let modalContents =
    <div>
      <h1>{title}</h1>
      <input type="text"
             className="modal__input"
             ref={(ref) => inputRef = ref}
             placeholder={placeholder}
             defaultValue={defaultValue}
             onKeyUp={(e) => onKeyPress(e)} />
      <div className="modal__button-group">
        {
          actions.map((action: ModalAction) =>
            <button className="modal__button"
                    onClick={() => onAction(action.name)}>{action.name}</button>
          )
        }
      </div>
    </div>;

  Modal.openModal(modalContents, () => {
    inputRef.focus();
    // Place cursor at the end of the input
    inputRef.setSelectionRange(inputRef.value.length, inputRef.value.length);
  });

}




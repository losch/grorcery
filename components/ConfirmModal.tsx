import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Classnames from 'classnames';
import * as Modal from './Modal';

function addKeyListener(handler) {
  document.body.addEventListener('keydown', handler);
}

function removeEventListener(handler) {
  document.body.removeEventListener('keydown', handler);
}

export function create(title: string,
                       okAction: () => void,
                       cancelAction?: () => void) {
  const onKeyPress = (e) => {
    if (e.key == 'Enter') onOk();
    else if (e.key == 'Escape') onCancel();
  };

  const onOk = () => {
    okAction();
    removeEventListener(onKeyPress);
    Modal.closeModal();
  };

  const onCancel = () => {
    if (cancelAction) {
      cancelAction();
    }
    removeEventListener(onKeyPress);
    Modal.closeModal();
  };

  let modalContents =
    <div>
      <h1>{title}</h1>
      <div className="modal__button-group">
        <button className="modal__button"
                onClick={onOk}>Ok</button>
        <button className="modal__button"
                onClick={onCancel}>Cancel</button>
      </div>
    </div>;

  Modal.openModal(modalContents, () => addKeyListener(onKeyPress));
}

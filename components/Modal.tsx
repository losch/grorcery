import './Modal.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Classnames from 'classnames';

export const MODAL_ID = 'modal';

interface ModalProps {
  children?: any;
}

class Modal extends React.Component<ModalProps, any> {
  render() {
    const { children } = this.props;
    return (
      <div>
        <div className="modal__overlay" />
        <div className="modal__outer">
          <div className="modal__contents">
            {children}
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Opens up a new modal and uses the given child elements as its contents
 * @param children - Child elements
 * @param callback - Function to call after opening the modal
 */
export function openModal(children: React.ReactElement<any>,
                          callback?: any): void {
  const modalNode = document.getElementById(MODAL_ID);

  ReactDOM.unmountComponentAtNode(modalNode);

  ReactDOM.render(
    <Modal>{children}</Modal>,
    modalNode,
    callback);
}

/**
 * Closes the modal
 */
export function closeModal(): void {
  const modalNode = document.getElementById(MODAL_ID);
  ReactDOM.unmountComponentAtNode(modalNode);
}

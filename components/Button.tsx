import './Button.scss';
import * as React from 'react';
import * as Classnames from 'classnames';

interface ButtonProps {
  onClick: (e: any) => void;
  children?: any;
  className?: string;
}

class Button extends React.Component<ButtonProps, any> {
  render() {
    const { onClick, children, className } = this.props;
    const buttonClassNames = Classnames(className, 'button');
    return (
      <button className={buttonClassNames}
              onClick={(e: any) => onClick(e)}>{children}</button>
    );
  }
}

export default Button;

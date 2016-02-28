import './Header.scss';
import * as React from 'react';
import * as Classnames from 'classnames';

interface HeaderProps {
  children?: any;
}

class Header extends React.Component<HeaderProps, any> {
  render() {
    const { children } = this.props;
    return (
      <div className="header">{children}</div>
    );
  }
}

export default Header;

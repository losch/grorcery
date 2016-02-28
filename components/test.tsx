import './test.scss';
import * as React from 'react';

interface HeaderProps {
    title: String;
}

class Header extends React.Component<HeaderProps, any> {
    render() {
        return (
            <div className="header">
                <h1>{this.props.title}</h1>
                <p className="header-text">Eggs ham bacon</p>
            </div>
        );
    }
}

export default Header;

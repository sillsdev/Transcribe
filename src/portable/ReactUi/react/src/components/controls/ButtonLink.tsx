import * as React from 'react';
import { Link } from 'react-router-dom';
import './ButtonLink.sass';

interface IProps {
    target: string;
    text: string;
    type: string;
};

class ButtonLink extends React.Component<IProps, object> {
    public render() {
        const { target, text, type } = this.props;
        return (
            <Link to={target} className="ButtonLink">
                <button className={type}>
                {text}
                </button>
            </Link>
        )
    }
};

export default ButtonLink;

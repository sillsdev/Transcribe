import * as React from 'react';
import { Link } from 'react-router-dom';
import './ButtonLink.sass';

interface IProps {
    select?: () => any;
    target: string;
    text: string;
    type: string;
};

class ButtonLink extends React.Component<IProps, object> {
    public render() {
        const { select, target, text, type } = this.props;
        return (
            <Link to={target} className="ButtonLink" onClick={select? select.bind(this):null}>
                <button className={type}>
                {text}
                </button>
            </Link>
        )
    }
};

export default ButtonLink;

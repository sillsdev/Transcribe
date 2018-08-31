import * as React from 'react';
import { Link } from 'react-router-dom';
import './ButtonLink.sass';

interface IProps {
    target: string;
    text: string;
    type: string;
};

class BackLink extends React.Component<IProps, object> {
    public render() {
        const { target, text, type } = this.props;
        return (
            <button id="ButtonLink" className={"ButtonLink " + type}>
                <Link to={target}>
                    {text}
                </Link>
            </button>
        )
    }
};

export default BackLink;

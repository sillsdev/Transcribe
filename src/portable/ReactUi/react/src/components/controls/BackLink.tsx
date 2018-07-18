import * as React from 'react';
import { Link } from 'react-router-dom';
import './BackLink.css';

interface IProps {
    target: string;
};

class BackLink extends React.Component<IProps, object> {
    public render() {
        const { target } = this.props;
        return (
            <div className="BackLink">
                <Link to={target}>
                    {"\u276E"}
                </Link>
            </div>
        )
    }
};

export default BackLink;

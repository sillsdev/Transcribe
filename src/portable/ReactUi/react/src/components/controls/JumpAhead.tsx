import * as React from 'react';
import { Link } from 'react-router-dom';
import './JumpAhead.css';

interface IProps {
    target: string;
};

class JumpAhead extends React.Component<IProps, object> {
    public render() {
        const { target } = this.props;
        return (
            <div className="JumpAhead">
                <Link to={target}>
                    {"\u00BB"}
                </Link>
            </div>
        )
    }
};

export default JumpAhead;

import * as React from 'react';
import { Link } from 'react-router-dom';
import './JumpBack.css';

interface IProps {
    target: string;
};

class JumpBack extends React.Component<IProps, object> {
    public render() {
        const { target } = this.props;
        return (
            <div className="JumpBack">
                <Link to={target}>
                    {"\u00AB"}
                </Link>
            </div>
        )
    }
};

export default JumpBack;

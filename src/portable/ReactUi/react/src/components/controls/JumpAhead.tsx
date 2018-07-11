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
                    {/* {"\u2039"} */}
                    {/* {"\u2329"} */}
                    {"\u00BB"}
                </Link>
            </div>
            )
    }
};

export default JumpAhead;

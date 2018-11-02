import * as React from 'react';
import { Link } from 'react-router-dom';
import './BackLink.sass';

interface IProps {
    action?: (context: any) => any;
    target: string;
};

class BackLink extends React.Component<IProps, object> {
    public render() {
        const { action, target } = this.props;
        return (
            <div id="BackLink" className="BackLink">
                <Link to={target} onClick={action}>
                    {"\u276E"}
                </Link>
            </div>
        )
    }
};

export default BackLink;

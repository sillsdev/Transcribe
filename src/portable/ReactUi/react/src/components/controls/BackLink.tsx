import * as React from 'react';
import { Link } from 'react-router-dom';
import './BackLink.sass';

interface IProps {
    action?: (context: any) => any;
    target: string;
    disable?:boolean;
};

class BackLink extends React.Component<IProps, object> {
    public render() {
        const { action, target, disable=false } = this.props;
        const linkWrapper = disable? "\u276E":(<Link to={target} onClick={action}>{"\u276E"}</Link>);
        return (
            <div id="BackLink" className="BackLink">
                {linkWrapper}
            </div>
        )
    }
};

export default BackLink;

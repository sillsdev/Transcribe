import * as React from 'react';
import { JumpChange } from '../../actions/audioActions';
import './JumpAhead.css';

interface IProps {
    JumpChange: typeof JumpChange;
};

class JumpAhead extends React.Component<IProps, object> {
    public render() {
        return (
            <div className="JumpAhead" onClick={this.props.JumpChange.bind(this, 2)}>
               {"\u00BB"}
            </div>
            )
    }
};

export default JumpAhead;

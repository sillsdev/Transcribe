import * as React from 'react';
import { JumpChange } from '../../actions/audioActions';
import './JumpBack.css';

interface IProps {
    jump?: number;
    JumpChange: typeof JumpChange;
};

class JumpBack extends React.Component<IProps, object> {
    public render() {
        return (
            <div className="JumpBack" onClick={this.props.JumpChange.bind(this, -2)}>
               {"\u00AB"}
            </div>
            )
    }
};

export default JumpBack;

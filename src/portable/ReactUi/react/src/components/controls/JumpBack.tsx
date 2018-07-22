import * as React from 'react';
import * as actions from '../../actions/audioActions';
import './JumpBack.css';

interface IProps {
    jump?: number;
    jumpChange: typeof actions.jumpChange;
};

class JumpBack extends React.Component<IProps, object> {
    public render() {
        return (
            <div className="JumpBack" onClick={this.props.jumpChange.bind(this, -2)}>
               {"\u00AB"}
            </div>
            )
    }
};

export default JumpBack;

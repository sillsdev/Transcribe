import * as React from 'react';
import * as actions from '../../actions/audioActions';
import './JumpAhead.css';

interface IProps {
    jumpChange: typeof actions.jumpChange;
};

class JumpAhead extends React.Component<IProps, object> {
    public render() {
        return (
            <div className="JumpAhead" onClick={this.props.jumpChange.bind(this, 2)}>
               {"\u00BB"}
            </div>
            )
    }
};

export default JumpAhead;

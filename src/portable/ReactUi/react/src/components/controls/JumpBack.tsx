import * as React from 'react';
import * as ReactToolTip from 'react-tooltip';
import * as actions from '../../actions/audioActions';
import './JumpBack.sass';

interface IProps {
    jump?: number;
    jumpChange: typeof actions.jumpChange;
};

class JumpBack extends React.Component<IProps, object> {
    public render() {
        return (
            <div>
                <ReactToolTip />
                <div id="JumpBack" className="JumpBack" data-tip="F1" onClick={this.props.jumpChange.bind(this, -2)}>
                    {"\u00AB"}
                </div>
            </div>
        )
    }
};

export default JumpBack;

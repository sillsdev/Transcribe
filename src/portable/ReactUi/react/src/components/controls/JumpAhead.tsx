import * as React from 'react';
import * as ReactToolTip from 'react-tooltip';
import * as actions from '../../actions/audioActions';
import './JumpAhead.sass';

interface IProps {
    jumpChange: typeof actions.jumpChange;
};

class JumpAhead extends React.Component<IProps, object> {
    public render() {
        return (

            <div>
                <ReactToolTip />
                <div className="JumpAhead" data-tip="F2" onClick={this.props.jumpChange.bind(this, 2)}>
                    {"\u00BB"}
                </div>
            </div>
        )
    }
};

export default JumpAhead;

import * as React from 'react';
import * as ReactToolTip from 'react-tooltip';
import * as actions from '../../actions/audioActions';
import './JumpAhead.sass';

interface IProps extends IStateProps{
    jump?: number;
    jumpChange: typeof actions.jumpChange;
};

class JumpAhead extends React.Component<IProps, object> {
    private forward: string;

    public componentWillMount()
    {
        const { selectedUser, users } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];

        // Get the forward hotkey specified for the user
        if (user && user.hotkey){
            this.forward = user.hotkey.filter(h => h.id === "forward")[0].text;
        }
    }
    public render() {
        const { jump, jumpChange } = this.props
        return (
            <div>
                <ReactToolTip />
                <div id="JumpAhead" className="JumpAhead" data-tip={this.forward} onClick={jumpChange.bind(this, jump? jump: 2)}>
                    {"\u00BB"}
                </div>
            </div>
        )
    }
};

interface IStateProps {
    selectedUser: string;
    users: IUser[];
};

export default JumpAhead;

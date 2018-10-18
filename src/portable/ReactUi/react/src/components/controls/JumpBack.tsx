import * as React from 'react';
import * as ReactToolTip from 'react-tooltip';
import * as actions from '../../actions/audioActions';
import './JumpBack.sass';

interface IProps extends IStateProps{
    jump?: number;
    jumpChange: typeof actions.jumpChange;
};

class JumpBack extends React.Component<IProps, object> {
    private back: string;

    public componentWillMount()
    {
        const { selectedUser, users } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];

        // Get the back hotkey specified for the user
        if (user && user.hotkey) {
            this.back = user.hotkey.filter(h => h.id === "back")[0].text;
        }
    }
    public render() {
        const { jump, jumpChange } = this.props
        return (
            <div>
                <ReactToolTip />
                <div id="JumpBack" className="JumpBack" data-tip={this.back} onClick={jumpChange.bind(this, jump? jump:-2)}>
                    {"\u00AB"}
                </div>
            </div>
        )
    }
};

interface IStateProps {
    selectedUser: string;
    users: IUser[];
};

export default JumpBack;

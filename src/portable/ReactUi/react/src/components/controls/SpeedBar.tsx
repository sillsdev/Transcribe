import * as React from 'react';
import * as ReactToolTip from 'react-tooltip';
import * as actions from '../../actions/audioActions';
import './SpeedBar.sass';

interface IProps extends IStateProps, IDispatchProps {
};

class SpeedBar extends React.Component<IProps, any> {
    private faster: string;
    private slower: string;

    constructor(props: IProps) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    public componentWillMount()
    {
        const { selectedUser, users } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];

        // Get the slower and faster hotkeys specified for the user
        if (user && user.hotkey !== undefined){
            this.slower = user.hotkey.filter(h => h.id === "slower")[0].text;
            this.faster = user.hotkey.filter(h => h.id === "faster")[0].text;
        }
    }

    public onChange(e: any) {
        const { playSpeedRateChange } = this.props;
        playSpeedRateChange(e.target.value)
    }

    public render() {
        const { direction, playSpeedRate } = this.props;
        const dirTip = (direction && direction === "rtl")?
            this.faster + " ⬌ " + this.slower :
            this.slower + " ⬌ " + this.faster
        return (
        <div>
            <ReactToolTip />
            <div className="SpeedBar" data-tip={dirTip}>
                <i className="slider-origin" />
                <input
                    id="speed"
                    type="range"
                    min=".5"
                    max="2.0"
                    step=".1"
                    defaultValue={playSpeedRate.toString()}
                    value={playSpeedRate.toString()}
                    onChange={this.onChange} />
            </div>
        </div>
        )
    }
};

interface IStateProps {
    direction?: string;
    playSpeedRate: number;
    selectedUser: string;
    users: IUser[];
};

interface IDispatchProps {
    playSpeedRateChange: typeof actions.playSpeedRateChange;
};

export default SpeedBar;


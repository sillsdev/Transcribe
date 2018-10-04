import * as React from 'react';
import * as ReactToolTip from 'react-tooltip';
import * as actions from '../../actions/audioActions';
import './PlayPause.sass';

interface IProps extends IStateProps{
    playing: boolean;
    playStatus: typeof actions.playStatus;
};

class PlayPause extends React.Component<IProps, object> {
    private playPause: string;

    public componentWillMount()
    {
        const { selectedUser, users } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];

        // Get the playpause hotkey specified for the user
        if (user.hotkey !== undefined){
            this.playPause = user.hotkey.filter(h => h.id === "play-pause")[0].text;
        }
    }
    public render() {
        const { playing, playStatus } = this.props;
        const playCharacter = playing? <div className='pause'>{"\u23F8"}</div> : 
            <div className='play'>{"\u25B6"}</div>;
        return (
            <div>
                <ReactToolTip />
                <div id="PlayPause" className="PlayPause" data-tip={this.playPause} onClick={playStatus.bind(this, !playing)}>
                    {playCharacter}
                </div>
            </div>
        )
    }
};

interface IStateProps {
    selectedUser: string;
    users: IUser[];
};

export default PlayPause;

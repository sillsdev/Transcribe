import * as React from 'react';
import * as actions from '../../actions/audioActions';
import './PlayPause.css';

interface IProps {
    playing: boolean;
    playStatus: typeof actions.playStatus;
};

class PlayPause extends React.Component<IProps, object> {
    public render() {
        const { playing, playStatus } = this.props;
        const playCharacter = playing? <div className='pause'>{"\u23F8"}</div> : 
            <div className='play'>{"\u25B6"}</div>;
        return (
            <div className="PlayPause" onClick={playStatus.bind(this, !playing)}>
               {playCharacter}
            </div>
            )
    }
};

export default PlayPause;

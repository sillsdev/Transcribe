import * as React from 'react';
import { playStatus } from '../../actions/audioActions';
import './PlayPause.css';

interface IProps {
    playing?: boolean;
    playStatus: typeof playStatus;
};

class PlayPause extends React.Component<IProps, object> {
    public render() {
        const { playing } = this.props;
        const playCharacter = playing? <div className='pause'>{"\u23F8"}</div> : 
            <div className='play'>{"\u25B6"}</div>;
        return (
            <div className="PlayPause" onClick={this.props.playStatus.bind(this, !playing)}>
               {playCharacter}
            </div>
            )
    }
};

export default PlayPause;

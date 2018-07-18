import * as React from 'react';
import ReactPlayer from 'react-player';
import { PlaySpeedRateChange, playStatus } from '../actions/audioActions';
import './ProgressPane.css';

interface IProps extends IStateProps, IDispatchProps {
};

const initialState = {
    audioPlayedSeconds: 0,
    totalSeconds: 0,
}

class ProgressPane extends React.Component<IProps, typeof initialState> {
    public readonly state = initialState;

    public onProgress = (ctrl: any) => {
        this.setState({
            audioPlayedSeconds: ctrl.playedSeconds,
            totalSeconds: ctrl.loadedSeconds,
        })
    }

    public render() {
        const { selectedTask } = this.props;
        const { audioPlayedSeconds, totalSeconds } = this.state;
        const audioFile = '/api/audio/' + selectedTask + '.mp3'
        return (
            <div className="ProgressPane"> 
                <div>
                    <progress
                        className="progressBar"
                        max={totalSeconds}
                        value={audioPlayedSeconds} />
                </div>
                <div className="RealPlayer">
                    <ReactPlayer
                        url={audioFile}
                        controls={true}
                        onEnded={this.props.playStatus.bind(this, false)}
                        playbackRate={this.props.playSpeedRate}
                        playing={this.props.playing}
                        onProgress={this.onProgress} />
                </div>
            </div>
        )
    }
};

interface IStateProps {
    playing?: boolean;
    playSpeedRate?: number;
    selectedTask: string;
};

interface IDispatchProps {
    playStatus: typeof playStatus,
    PlaySpeedRateChange: typeof PlaySpeedRateChange;
};
  
export default ProgressPane;

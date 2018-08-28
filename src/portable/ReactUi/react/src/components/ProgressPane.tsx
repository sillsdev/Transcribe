import * as React from 'react';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import * as actions from '../actions/audioActions';
import { IState } from '../model/state';
import TimeMarker from './controls/TimeMarker';
import './ProgressPane.sass';

interface IProps extends IStateProps, IDispatchProps {
};

const initialState = {
    audioPlayedSeconds: 0,
    seeking: false,
    totalSeconds: 0,
}

class ProgressPane extends React.Component<IProps, typeof initialState> {
    public readonly state = initialState;
    public player: any;

    public onProgress = (ctrl: any) => {
        if (!this.state.seeking){
            if (this.state.totalSeconds === 0) {
                this.props.saveTotalSeconds(ctrl.loadedSeconds);
            }
            this.setState({
                audioPlayedSeconds: ctrl.playedSeconds,
                seeking: false,
                totalSeconds: ctrl.loadedSeconds,
            })
        }
    }

    public onPause = () => {
       // tslint:disable-next-line:no-console
       console.log("paused at:" + this.state.audioPlayedSeconds);
    }

    public onSeekMouseDown = () => {
        this.setState({ ...this.state, seeking: true })
    }

    public onSeekMouseUp = (e:React.MouseEvent) => {
        this.setState({ ...this.state, seeking:false })
        this.player.seekTo((e.clientX - 543) / e.currentTarget.clientWidth)
       // tslint:disable-next-line:no-console
       console.log("up at:" + e.clientX);
    }

    public ref = (player: any) => {
        this.player = player
    }

    public render() {
        const { initialPosition, jump, requestReport, selectedTask, selectedUser, users } = this.props;
        const { audioPlayedSeconds, totalSeconds } = this.state;
        const audioFile = '/api/audio/' + selectedTask
        const user = users.filter(u => u.username.id === selectedUser)[0];
        let position = audioPlayedSeconds;
        if (jump !== 0){
            position += jump;
            this.player.seekTo(position);
            this.props.jumpChange(0);
        }
        if (position === 0 && initialPosition != null && initialPosition.toString() !== "0") {
            position += initialPosition
            this.player.seekTo(position)
        }
        if (requestReport) {
            this.props.reportPosition(selectedTask, audioPlayedSeconds);
        }
        return (
            <div className="ProgressPane">
                <div className="progress">
                    <progress
                        id="ProgressBar"
                        className="progressBar"
                        max={totalSeconds}
                        onMouseDown={this.onSeekMouseDown}
                        onMouseUp={this.onSeekMouseUp}
                        value={position} />
                </div>
                <div className="timeMarker">
                    <TimeMarker
                        playedSeconds={audioPlayedSeconds}
                        totalSeconds={totalSeconds}
                        timer={user !== undefined? user.timer: "countup"} />
                </div>
                <div className="RealPlayer">
                    <ReactPlayer
                        id="Player"
                        ref={this.ref}
                        url={audioFile}
                        controls={true}
                        onPause={this.onPause}
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
    initialPosition: number;
    playing: boolean;
    playSpeedRate: number;
    requestReport: boolean;
    selectedTask: string;
    selectedUser: string;
    jump: number;
    users: IUser[];
};

interface IDispatchProps {
    jumpChange: typeof actions.jumpChange,
    playStatus: typeof actions.playStatus,
    playSpeedRateChange: typeof actions.playSpeedRateChange;
    reportPosition: typeof actions.reportPosition;
    saveTotalSeconds: typeof actions.saveTotalSeconds;
};

const mapStateToProps = (state: IState): IStateProps => ({
    initialPosition: state.audio.initialPosition,
    jump:  state.audio.jump,
    playSpeedRate:  state.audio.playSpeedRate,
    playing: state.audio.playing,
    requestReport: state.audio.requestReport,
    selectedTask:  state.tasks.selectedTask,
    selectedUser: state.users.selectedUser,
    users: state.users.users
});

export default connect(mapStateToProps)(ProgressPane);

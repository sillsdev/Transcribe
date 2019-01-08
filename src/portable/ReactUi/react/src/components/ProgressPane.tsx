import * as React from 'react';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/audioActions';
import { log } from '../actions/logAction';
import * as actions1 from '../actions/taskActions';
import { IState } from '../model/state';
import uiDirection from '../selectors/direction';
import projectTasks from '../selectors/projectTasks';
import TimeMarker from './controls/TimeMarker';
import './ProgressPane.sass';
import AnchorHelp from './ui-controls/AnchorHelp';

interface IProps extends IStateProps, IDispatchProps {
};

const initialState = {
    audioPlayedSeconds: 0,
    seeking: false,
    totalSeconds: 0,
}

class ProgressPane extends React.Component<IProps, typeof initialState> {
    public readonly state = { ...initialState };
    public player: any;
    private progressRef: React.RefObject<HTMLProgressElement>;

    public constructor(props: IProps) {
        super(props);
        this.progressRef = React.createRef();
    }

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
            this.props.setPlayedSeconds(this.state.audioPlayedSeconds);
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
        const { direction } = this.props;
        this.setState({ ...this.state, seeking:false })
        const clientWidth = this.progressRef && this.progressRef.current && this.progressRef.current.clientWidth? this.progressRef.current.clientWidth: 673;
        const offsetLeft = this.progressRef && this.progressRef.current && this.progressRef.current.offsetLeft? this.progressRef.current.offsetLeft: 147;
        if (direction && direction === "rtl") {
            this.player.seekTo((clientWidth - (e.clientX - offsetLeft)) / clientWidth)
        } else {
            this.player.seekTo((e.clientX - offsetLeft) / clientWidth)
        }
        // tslint:disable-next-line:no-console
        // console.log(this.progressRef.current);
    }

    public ref = (player: any) => {
        this.player = player
    }

    public render() {
        const { direction, initialPosition, jump, requestReport, selectedTask, selectedUser, users, tasks } = this.props;
        const { audioPlayedSeconds, totalSeconds } = this.state;
        const audioFile = '/api/audio/' + selectedTask
        const user = users.filter(u => u.username.id === selectedUser)[0];
        const task = tasks.filter(t => t.id === selectedTask)[0];

        log("ProgressPane")
        if(task && task.length && (totalSeconds !== task.length))
        {
            this.setState({ totalSeconds: task.length })
        }
        const position = audioPlayedSeconds;
        if (this.player !== undefined && jump !== 0){
            this.player.seekTo(this.adjustPosition(position, jump));
            this.props.jumpChange(0);
        }
        if (this.player && position === 0 && initialPosition > 1 && initialPosition <= totalSeconds) {
            this.player.seekTo(this.adjustPosition(position, initialPosition));
        }
        if (requestReport) {
            this.props.reportPosition(selectedTask, audioPlayedSeconds);
        }
        return (
            <div className="ProgressPane">
                <div className="progress">
                    <progress
                        ref={this.progressRef}
                        id="ProgressBar"
                        className="progressBar"
                        max={totalSeconds}
                        onMouseDown={this.onSeekMouseDown}
                        onMouseUp={this.onSeekMouseUp}
                        value={position} />
                </div>
                <div className="timeMarker">
                    <TimeMarker
                        direction={direction}
                        playedSeconds={audioPlayedSeconds}
                        totalSeconds={totalSeconds}
                        timer={user && user.timer? user.timer: "countup"} />
                </div>
                <AnchorHelp id="ProjSettingsHelp" onClick={this.ShowAudioPanelHelp} color="yellow" />
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

    private ShowAudioPanelHelp = () => {
        this.props.showHelp("User Interface overview")
    }

    private adjustPosition(position: number, jump: number) {
        const { totalSeconds } = this.state;
        position += jump;
        if (totalSeconds && (position > totalSeconds)) {
            position = totalSeconds;
        }
        if (position <= 1) {
            position = 0;
        }
        return position;
    }
};

interface IStateProps {
    direction: string;
    initialPosition: number;
    playing: boolean;
    playSpeedRate: number;
    requestReport: boolean;
    selectedTask: string;
    selectedUser: string;
    jump: number;
    users: IUser[];
    tasks: ITask[];
};

interface IDispatchProps {
    jumpChange: typeof actions.jumpChange,
    playStatus: typeof actions.playStatus,
    playSpeedRateChange: typeof actions.playSpeedRateChange;
    reportPosition: typeof actions.reportPosition;
    saveTotalSeconds: typeof actions.saveTotalSeconds;
    setPlayedSeconds: typeof actions.setPlayedSeconds;
    showHelp: typeof actions1.showHelp,
};

const mapStateToProps = (state: IState): IStateProps => ({
    direction: uiDirection(state),
    initialPosition: state.audio.initialPosition,
    jump:  state.audio.jump,
    playSpeedRate:  state.audio.playSpeedRate,
    playing: state.audio.playing,
    requestReport: state.audio.requestReport,
    selectedTask:  state.tasks.selectedTask,
    selectedUser: state.users.selectedUser,
    tasks: projectTasks(state),
    users: state.users.users,
});

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
    jumpChange: actions.jumpChange,
    playSpeedRateChange: actions.playSpeedRateChange,
    playStatus: actions.playStatus,
    reportPosition: actions.reportPosition,
    saveTotalSeconds: actions.saveTotalSeconds,
    setPlayedSeconds: actions.setPlayedSeconds,
    showHelp: actions1.showHelp,
}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProgressPane);

import * as React from 'react';
import { HotKeys } from 'react-hotkeys';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/audioActions';
import * as actions2 from '../actions/taskActions';
import SucessPanel from '../components/SucessPanel'
import { ITranscriberStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize';
import projectState from '../selectors/projectState';
import AudioPanel from './AudioPanel'
import './MainLayout.sass';
import NavPanel from './NavPanel'
import TaskPanel from './TaskPanel'

interface IProps extends IStateProps, IDispatchProps {
};

class MainLayout extends React.Component<IProps, any> {
    private back: string;
    private faster: string;
    private forward: string;
    private playPause: string;
    private slower: string;

    public componentWillMount()
    {
        const { selectedUser, users } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];

        // Get the hotkeys specified for the user
        if (user.hotkey !== undefined){
            this.playPause = user.hotkey.filter(h => h.id === "play-pause")[0].text.toLowerCase();
            this.back = user.hotkey.filter(h => h.id === "back")[0].text.toLowerCase();
            this.forward = user.hotkey.filter(h => h.id === "forward")[0].text.toLowerCase();
            this.slower = user.hotkey.filter(h => h.id === "slower")[0].text.toLowerCase();
            this.faster = user.hotkey.filter(h => h.id === "faster")[0].text.toLowerCase();         
        }
    }

    public render() {
        const { jumpChange, playing, playSpeedRate, playSpeedRateChange, playStatus, saved, submit } = this.props;

        const keyMap = {
            backKey: this.back,
            fasterKey: this.faster,
            forwardKey: this.forward,
            playPauseKey: this.playPause,
            slowerKey: this.slower,
        }

        const handlers = {
            backKey: (event: any) => {
                jumpChange(-2);
            },
            fasterKey: (event: any) => {
                let speedUp = playSpeedRate + 0.1;
                if(playSpeedRate >= 2.0)
                {
                    speedUp = 2.0
                }
                playSpeedRateChange(speedUp);
            },
            forwardKey: (event: any) => {
                jumpChange(2);
            },
            playPauseKey : (event: any) => {
                playStatus(!playing);
            },
            slowerKey: (event: any) => {
                let speedDown = playSpeedRate - 0.1;
                if(playSpeedRate <= 0.5)
                {
                    speedDown = 0.5
                }
                playSpeedRateChange(speedDown);
            },
        };

        const editorScreen = (submit && saved)? <SucessPanel  {...this.props} />:  <AudioPanel {...this.props} />;

        return (
            <HotKeys keyMap={keyMap} handlers={handlers}>
                <div className="MainLayout" tabIndex={1}>
                    <div className="NavCol">
                        <NavPanel {...this.props} />
                    </div>
                    <div className="TaskCol">
                        <TaskPanel {...this.props} />
                    </div>
                    <div className="MainCol">
                       {editorScreen}
                    </div>
                </div>
            </HotKeys>
        )
    }
};

interface IStateProps {
    playing: boolean;
    playSpeedRate: number;
    projectState: string | undefined;
    selectedTask: string;
    selectedUser: string;
    saved: boolean;
    submit: boolean;
    jump: number;
    strings: ITranscriberStrings;
    users: IUser[];
};

const mapStateToProps = (state: IState): IStateProps => ({
    jump: state.audio.jump,
    playSpeedRate: state.audio.playSpeedRate,
    playing: state.audio.playing,
    projectState: projectState(state),
    saved: state.audio.saved,
    selectedTask: state.tasks.selectedTask,
    selectedUser: state.users.selectedUser,
    strings: userStrings(state, { layout: "transcriber" }),
    submit: state.audio.submit,
    users: state.users.users,
});

interface IDispatchProps {
    completeReview: typeof actions2.completeReview;
    completeTranscription: typeof actions2.completeTranscription;
    playStatus: typeof actions.playStatus;
    playSpeedRateChange: typeof actions.playSpeedRateChange;
    jumpChange: typeof actions.jumpChange;
    reportPosition: typeof actions.reportPosition;
    saveTotalSeconds: typeof actions.saveTotalSeconds;
    setSubmitted: typeof actions.setSubmitted;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        completeReview: actions2.completeReview,
        completeTranscription: actions2.completeTranscription,
        jumpChange: actions.jumpChange,
        playSpeedRateChange: actions.playSpeedRateChange,
        playStatus: actions.playStatus,
        reportPosition: actions.reportPosition,
        saveTotalSeconds: actions.saveTotalSeconds,
        setSubmitted: actions.setSubmitted,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);

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
    public render() {
        const { jumpChange, playing, playSpeedRate, playSpeedRateChange, playStatus, saved, submit } = this.props;

        const keyMap = {
            moveUp: 'up',
        }

        const handlers = {
            'esc': (event: any) => {
                playStatus(!playing);
            },
            'f1': (event: any) => {
                jumpChange(-2);
            },
            'f2': (event: any) => {
                jumpChange(2);
            },
            'f3': (event: any) => {
                let speedDown = playSpeedRate - 0.1;
                if(playSpeedRate <= 0.5)
                {
                    speedDown = 0.5
                }
                playSpeedRateChange(speedDown);
            },
            'f4': (event: any) => {
                let speedUp = playSpeedRate + 0.1;
                if(playSpeedRate >= 2.0)
                {
                    speedUp = 2.0
                }
                playSpeedRateChange(speedUp);
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

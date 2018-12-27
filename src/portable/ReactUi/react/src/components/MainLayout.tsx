import * as React from 'react';
import { HotKeys } from 'react-hotkeys';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/audioActions';
import { log } from '../actions/logAction';
import * as actions2 from '../actions/taskActions';
import SucessPanel from '../components/SucessPanel';
import { ITranscriberStrings } from '../model/localize';
import { IState } from '../model/state';
import taskList from '../selectors';
import uiDirection from '../selectors/direction';
import userStrings from '../selectors/localize';
import currentProject from '../selectors/project';
import projectState from '../selectors/projectState';
import taskValues from '../selectors/taskValues';
import AudioPanel from './AudioPanel';
import GreetingPanel from './GreetingPanel';
import './MainLayout.sass';
import NavPanel from './NavPanel';
import TaskPanel from './TaskPanel';

interface IProps extends IStateProps, IDispatchProps {
    history: {
        location: {
            pathname: string;
        }
    }
};

const initialState = {
    highlightSeconds: 0,
}

class MainLayout extends React.Component<IProps, any> {
    private back: string;
    private faster: string;
    private forward: string;
    private playPause: string;
    private slower: string;
    private interval: any;

    public constructor(props: IProps) {
        super(props);
        this.state = {...initialState}
    }
    public componentWillMount()
    {
        const { selectedUser, users } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];

        // Get the hotkeys specified for the user
        if (user && user.hotkey !== undefined){
            this.playPause = user.hotkey.filter(h => h.id === "play-pause")[0].text.toLowerCase();
            this.back = user.hotkey.filter(h => h.id === "back")[0].text.toLowerCase();
            this.forward = user.hotkey.filter(h => h.id === "forward")[0].text.toLowerCase();
            this.slower = user.hotkey.filter(h => h.id === "slower")[0].text.toLowerCase();
            this.faster = user.hotkey.filter(h => h.id === "faster")[0].text.toLowerCase();         
        }
    }

    public componentWillUpdate() {
        const { todoHighlight, setToDoHighlight } = this.props
        if ( todoHighlight && this.state.highlightSeconds === 1 ) {
            setToDoHighlight(false);
            this.setState({ highlightSeconds: 0 });
        }
    }

    public componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000);
    }

    public componentWillUnmount() {
        clearInterval(this.interval);
    }

    public tick() {
        const { todoHighlight } = this.props
        if(todoHighlight)
        {
            this.setState((prevState: any) => ({
                ...this.state,
                highlightSeconds: prevState.highlightSeconds + 1
            }));
        }

    }

    public render() {
        const { jumpChange, playing, playSpeedRate, playSpeedRateChange, playStatus, saved, submit,
            assignedReview, assignedTranscribe, availableReview,  availableTranscribe, direction, project, todoHighlight} = this.props;

        log("MainLayout")
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
                let speedUp = parseFloat(playSpeedRate.toString()) + 0.1;
                if(parseFloat(playSpeedRate.toString()) >= 2.0)
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
                let speedDown =  parseFloat(playSpeedRate.toString()) - 0.1;
                if (parseFloat(playSpeedRate.toString()) <= 0.5) {
                    speedDown = 0.5
                }
                playSpeedRateChange(speedDown);
            },
        };

        let editorScreen = <GreetingPanel   {...this.props} />

        const claim = project && project.claim? project.claim: false;
        if (assignedReview.length + assignedTranscribe.length > 0 ||
            (claim && availableReview.length + availableTranscribe.length  > 0))
        {
            const sync = project && project.sync? project.sync: false;
            editorScreen = (submit && saved) ? <SucessPanel  {...this.props} sync={sync} /> : <AudioPanel {...this.props} />;
        }

        let settingsStyle = this.props.history.location.pathname.length > 5? " Modal": ""
        settingsStyle = direction? settingsStyle + " " + direction: settingsStyle;

        return (
            <HotKeys keyMap={keyMap} handlers={handlers}>
                <div  className={"MainLayout" + settingsStyle} tabIndex={1}>
                    <div className="NavCol">
                        <NavPanel {...this.props} />
                    </div>
                    <div className={todoHighlight? "TaskCol TodoBorderOn": "TaskCol TodoBorderOff"}>
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
    assignedReview: ITask[];
    assignedTranscribe: ITask[];
    availableReview: ITask[];
    availableTranscribe: ITask[];
    direction: string;
    heading: string;
    jump: number;
    playSpeedRate: number;
    playing: boolean;
    project: IProject;
    projectState: string | undefined;
    saved: boolean;
    selectedTask: string;
    selectedUser: string;
    strings: ITranscriberStrings;
    submit: boolean;
    users: IUser[];
    todoHighlight: boolean;
};

const mapStateToProps = (state: IState): IStateProps => ({
    assignedReview: taskList(state).assignedReview,
    assignedTranscribe: taskList(state).assignedTranscribe,
    availableReview: taskList(state).availableReview,
    availableTranscribe: taskList(state).availableTranscribe,
    direction: uiDirection(state),
    heading: taskValues(state).heading,
    jump: state.audio.jump,
    playSpeedRate: state.audio.playSpeedRate,
    playing: state.audio.playing,
    project: currentProject(state),
    projectState: projectState(state),
    saved: state.audio.saved,
    selectedTask: state.tasks.selectedTask,
    selectedUser: state.users.selectedUser,
    strings: userStrings(state, { layout: "transcriber" }),
    submit: state.audio.submit,
    todoHighlight: state.tasks.todoHighlight,
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
    assignTask: typeof actions2.assignTask;
    unassignTask: typeof actions2.unAssignTask;
    setToDoHighlight: typeof actions2.setToDoHightlight;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        assignTask: actions2.assignTask,
        completeReview: actions2.completeReview,
        completeTranscription: actions2.completeTranscription,
        jumpChange: actions.jumpChange,
        playSpeedRateChange: actions.playSpeedRateChange,
        playStatus: actions.playStatus,
        reportPosition: actions.reportPosition,
        saveTotalSeconds: actions.saveTotalSeconds,
        setSubmitted: actions.setSubmitted,
        setToDoHighlight: actions2.setToDoHightlight,
        unassignTask: actions2.unAssignTask,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);

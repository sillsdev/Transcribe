import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions2 from '../actions/audioActions';
import * as actions from '../actions/taskActions';
import { IState } from '../model/state';
import language from '../selectors/language';
import './EditorPane.sass'

interface IProps extends IStateProps, IDispatchProps {
}

const initialState = {
    seconds: 0,
    text: "",
}
class EditorPane extends React.Component<IProps, typeof initialState> {
    public state: typeof initialState;
    private interval: any;

    public constructor(props: IProps) {
        super(props);
        this.state = initialState
        this.change = this.change.bind(this);
        this.keyUp = this.keyUp.bind(this);
    }

    public componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000);
      }

    public componentWillUnmount() {
        clearInterval(this.interval);
    }

    public render() {
        const { direction, initialTranscription, saved, submit, lang, users,
            selectedProject, selectedTask, selectedUser, totalSeconds,
            transcription, writeTranscription } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];
        const project = user && user.project.filter(p => p.id === selectedProject)[0];
        const font = project != null? project.fontfamily: "SIL Charis"; // Tests null or undefined
        const size = project != null? project.fontsize: "12pt"; // Tests null or undefined

        if (transcription != null && this.state.text !== transcription  && initialTranscription) {
            this.setState({text: transcription})
        }
        if (submit && !saved) {
            writeTranscription(selectedTask, totalSeconds, lang, direction, this.state)
        }
        return (
            <div className="EditorPane">
                <textarea
                    id="Editor"
                    value={this.state.text}
                    style={{fontFamily: font, fontSize: size}} 
                    onChange={this.change} 
                    onKeyUp={this.keyUp}
                    />
            </div>
        )
    }

    public componentWillUpdate() {
        const { direction, lang, saved, selectedTask, totalSeconds, writeTranscription } = this.props;
        if (this.state.seconds === 60) {
            this.setState({
                seconds: 0
            });
            if (!saved) {
                writeTranscription(selectedTask, totalSeconds, lang, direction, this.state)
            }
        }
    }
    private tick() {
        this.setState(prevState => ({
            ...this.state,
            seconds: prevState.seconds + 1
        }));
    }

    private change(event: any) {
        this.setState({
            ...this.state,
            text: event.target.value
        });
    }

    private keyUp(event: any) {
        const { direction, setSaved, setInitialTranscription, lang, requestPosition, saved, selectedTask, totalSeconds, writeTranscription } = this.props;
        if (event.keyCode === 32) {
            requestPosition();
            writeTranscription(selectedTask, totalSeconds, lang, direction, this.state)
        } else if (saved) {
            setSaved(false);
        }
        setInitialTranscription(false);
    }
};

interface IStateProps {
    direction: string;
    initialTranscription: boolean;
    submit: boolean;
    lang: string;
    saved: boolean;
    selectedUser: string;
    selectedProject: string;
    selectedTask: string;
    totalSeconds: number;
    transcription: string;
    users: IUser[];
};

const mapStateToProps = (state: IState): IStateProps => ({
    direction: language(state).direction,
    initialTranscription: state.audio.initialTranscription,
    lang: language(state).lang,
    saved: state.audio.saved,
    selectedProject: state.tasks.selectedProject,
    selectedTask: state.tasks.selectedTask,
    selectedUser: state.users.selectedUser,
    submit: state.audio.submit,
    totalSeconds: state.audio.totalSeconds,
    transcription: state.audio.transcription,
    users: state.users.users,
});

interface IDispatchProps {
    setSaved: typeof actions2.setSaved;
    requestPosition: typeof actions2.requestPosition;
    setInitialTranscription: typeof actions2.setInitialTranscription;
    writeTranscription: typeof actions.writeTranscription;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        requestPosition: actions2.requestPosition,
        setInitialTranscription: actions2.setInitialTranscription,
        setSaved: actions2.setSaved,
        writeTranscription: actions.writeTranscription,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorPane);

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
    initial: true,
    saved: true,
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
        const { fetchTranscription, selectedTask } = this.props;

        fetchTranscription(selectedTask);
        this.interval = setInterval(() => this.tick(), 1000);
      }

    public componentWillUnmount() {
        clearInterval(this.interval);
    }

    public render() {
        const { users, selectedProject, selectedUser, transcription } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];
        const project = user && user.project.filter(p => p.id === selectedProject)[0];
        const font = project != null? project.fontfamily: "SIL Charis"; // Tests null or undefined
        const size = project != null? project.fontsize: "12pt"; // Tests null or undefined

        if (transcription != null && this.state.text !== transcription && this.state.text === "" && this.state.initial) {
            this.setState({text: transcription})
        }
        return (
            <div className="EditorPane">
                <textarea
                    value={this.state.text}
                    style={{fontFamily: font, fontSize: size}} 
                    onChange={this.change} 
                    onKeyUp={this.keyUp}
                    />
            </div>
        )
    }

    public componentWillUpdate() {
        const { direction, lang, selectedTask, totalSeconds, writeTranscription } = this.props;

        if (this.state.seconds === 60) {
            if (!this.state.saved) {
                writeTranscription(selectedTask, totalSeconds, lang, direction, this.state)
            }
            this.setState({
                ...this.state,
                saved: true,
                seconds: 0
            });
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
        const { direction, lang, requestPosition, selectedTask, totalSeconds, writeTranscription } = this.props;
        this.setState({
            ...this.state,
            initial: false,
            saved: false,
        })
        if (event.keyCode === 32) {
            requestPosition();
            writeTranscription(selectedTask, totalSeconds, lang, direction, this.state)
            this.setState({
                ...this.state,
                saved: true,
            })
        }
    }
};

interface IStateProps {
    direction: string;
    lang: string;
    selectedUser: string;
    selectedProject: string;
    selectedTask: string;
    totalSeconds: number;
    transcription: string;
    users: IUser[];
};

const mapStateToProps = (state: IState): IStateProps => ({
    direction: language(state).direction,
    lang: language(state).lang,
    selectedProject: state.tasks.selectedProject,
    selectedTask: state.tasks.selectedTask,
    selectedUser: state.users.selectedUser,
    totalSeconds: state.audio.totalSeconds,
    transcription: state.audio.transcription,
    users: state.users.users,
});

interface IDispatchProps {
    fetchTranscription: typeof actions2.fetchTranscription;
    requestPosition: typeof actions2.requestPosition;
    writeTranscription: typeof actions.writeTranscription;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        fetchTranscription: actions2.fetchTranscription,
        requestPosition: actions2.requestPosition,
        writeTranscription: actions.writeTranscription,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorPane);

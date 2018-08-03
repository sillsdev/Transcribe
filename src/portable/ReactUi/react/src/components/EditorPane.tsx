import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/taskActions';
import { IState } from '../model/state';
import './EditorPane.css'

interface IProps extends IStateProps, IDispatchProps {
}

const initialState = {
    text: ""
}
class EditorPane extends React.Component<IProps, typeof initialState> {
    public state: typeof initialState;

    public constructor(props: IProps) {
        super(props);
        this.state = initialState
        this.change = this.change.bind(this);
        this.keyUp = this.keyUp.bind(this);
    }

    public render() {
        const { users, selectedProject, selectedUser } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];
        const project = user && user.project.filter(p => p.id === selectedProject)[0];
        const font = project != null? project.fontfamily: "SIL Charis"; // Tests null or undefined
        const size = project != null? project.fontsize: "12pt"; // Tests null or undefined

        return (
            <div className="EditorPane">
                <textarea
                    style={{fontFamily: font, fontSize: size}} 
                    onChange={this.change} 
                    onKeyUp={this.keyUp}
                    />
            </div>
        )
    }

    private change(event: any) {
        this.setState({ text: event.target.value });
    }

    private keyUp(event: any) {
        const { selectedTask, writeTranscription } = this.props;
        if (event.keyCode === 32) {
            writeTranscription(selectedTask, this.state)
        }
    }
};

interface IStateProps {
    selectedUser: string;
    selectedProject: string;
    selectedTask: string;
    users: IUser[];
};

const mapStateToProps = (state: IState): IStateProps => ({
    selectedProject: state.tasks.selectedProject,
    selectedTask: state.tasks.selectedTask,
    selectedUser: state.users.selectedUser,
    users: state.users.users,
});

interface IDispatchProps {
    writeTranscription: typeof actions.writeTranscription,
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        writeTranscription: actions.writeTranscription,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorPane);

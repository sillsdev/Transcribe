import * as React from 'react';
import Avatar from 'react-avatar';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/taskActions';
import * as actions2 from '../actions/userActions';
import Duration from '../components/controls/Duration';
import { IProjectSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize'
import allTasks from '../selectors/task';
import NextAction from './controls/NextAction';
import './TaskDetails.sass';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';
import SelectField from './ui-controls/SelectField';
import TextField from './ui-controls/TextField';

interface IProps extends IStateProps, IDispatchProps {
    history: {
        location: {
            pathname: string;
        }
    }
};

class TaskDetails extends React.Component<IProps, any> {
    private audioFileRef: React.RefObject<TextField>;
    private referenceRef: React.RefObject<TextField>;
    private headingRef: React.RefObject<TextField>;
    private assignedToRef: React.RefObject<SelectField>;

    constructor(props: IProps) {
        super(props)
        this.audioFileRef = React.createRef();
        this.referenceRef = React.createRef();
        this.headingRef = React.createRef();
        this.assignedToRef = React.createRef();
    }

    public render() {

        // Display Strings
        let displayHeading = "Heading";
        let displayReference = "Reference";
        let displayUserName = "Assigned To";
        let displayUserAvatarUri = "Avatar";
        let displayDuration = 0;

        let taskAudioFile = "";
        let taskReference = "";
        let taskHeading = "";
        let taskAssignedTo = "";
        let displayId = "";
        let task;

        const deleteTask = () => { alert("Delete Task") }
        const { tasks, selectedPopupTask, strings, users } = this.props;
        const theCurrentTask = this.props.history.location.pathname.indexOf("NewTask") > 0 ? "" : selectedPopupTask;

        if (theCurrentTask !== "") {
            task = tasks.filter(t => t.id === theCurrentTask)[0];
            const idParts = theCurrentTask.split('-');
            displayReference = displayId = ((idParts.length === 4) ? idParts[1] + " " + Number(idParts[2]) + ":" + Number(idParts[3].slice(0, 3)) + "-" + Number(idParts[3].slice(3, 6)) : "")
            taskAudioFile = task.id;
            taskReference = displayId;
            displayHeading = taskHeading = task.name;
            taskAssignedTo = task.assignedto;
            const taskUser = users.filter(u => u.username.id = taskAssignedTo)[0];
            displayUserName = taskAssignedTo = taskUser.displayName;
            displayUserAvatarUri = taskUser.username.avatarUri;
            displayDuration = task.length ? task.length : 0
        }

        const saveMethod = () => this.save(this)

        return (
            <div className="TaskDetails">
                <div className="closeRow">
                    <Link onClick={saveMethod} to="/ProjectSettings">
                        <img src="/assets/close-x.svg" alt="X" />
                    </Link>
                </div>
                <div className="titleRow">
                    <div className="title">
                        <LabelCaptionUx name={strings.taskDetails} type="H2" />
                    </div>
                    <div className="deleteButton">
                        <NextAction text={strings.delete} target={deleteTask} type="danger" />
                    </div>
                </div>
                <div className="details">
                    <div className="results">
                        <div className="resultsLeft">
                            <img src="/assets/waveform.png" />
                            <div className="taskItemContent">
                                <div className="firstLine">
                                    <span className="displayReference">{displayReference}</span>
                                    <span className="totalTime"><Duration seconds={displayDuration} /></span>
                                </div>
                                <div className="textName">{displayHeading}</div>
                            </div>
                            <div className="AvatarRow">
                                <Avatar name={displayUserName} src={displayUserAvatarUri} size={64} round={true} />
                                <div className="AvatarCaption">{displayUserName}</div>
                            </div>
                        </div>
                        <div className="resultsRight">
                            <div><TextField id="id1" ref={this.audioFileRef} caption="Audio File" inputValue={taskAudioFile} isReadOnly={false} /></div>
                            <div><TextField id="id2" ref={this.referenceRef} caption="Reference" inputValue={taskReference} isReadOnly={true} /></div>
                            <div><TextField id="id3" ref={this.headingRef} caption="Heading" inputValue={taskHeading} /></div>
                            <div><SelectField id="id4" ref={this.assignedToRef} caption="Assigned To" selected={taskAssignedTo} options={users} /></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    private saveValue(updates: string[], tag: string, val: string | null) {
        updates.push(tag + "=" + encodeURIComponent(val !== null ? val : ""))
    }

    private save(context: TaskDetails) {
        // const { selectedParatextProject, selectedPopupTask, selectedProject, tasks, updateTask, users } = this.props;
        const { selectedPopupTask, selectedProject, tasks, updateTask } = this.props;
        const theCurrentTask = this.props.history.location.pathname.indexOf("NewTask") > 0 ? "" : selectedPopupTask;
        // let taskAudioFile = "";
        let taskReference = "";
        let taskHeading = "";
        let taskAssignedTo = "";
        let displayId = "";
        let task;
        // let taskUser;

        if (theCurrentTask !== "") {
            task = tasks.filter(t => t.id === theCurrentTask)[0];
            const idParts = theCurrentTask.split('-');
            displayId = ((idParts.length === 4) ? idParts[1] + " " + Number(idParts[2]) + ":" + Number(idParts[3].slice(0, 3)) + "-" + Number(idParts[3].slice(3, 6)) : "")
            // taskAudioFile = task.id;
            taskReference = displayId;
            taskHeading = task.name;
            taskAssignedTo = task.assignedto;
            // taskUser = users.filter(u => u.username.id = taskAssignedTo)[0];
        }

        const updates = Array<string>();
        let isValid = true;
        // Name
        const audioFile = context.audioFileRef.current && context.audioFileRef.current.state.current;
        if (audioFile !== null && audioFile !== undefined) {
            if (audioFile.length === 0) {
                if (context.audioFileRef.current !== null) {
                    context.audioFileRef.current.state.current = "Please fill in the Audio File.";
                    this.setState({ message: "Please fill in the Audio File." });
                    isValid = false;
                }
            }
            else if (audioFile.length > 0) {
                if (context.audioFileRef.current !== null) {
                    context.audioFileRef.current.state.current = "";
                    this.setState({ message: "" });
                    isValid = true;
                }
                if (taskAssignedTo !== audioFile) {
                    this.saveValue(updates, "audioFile", audioFile)
                }
            }
        }

        const reference = context.referenceRef.current && context.referenceRef.current.state.current;
        if (reference !== null && reference !== undefined) {
            if (reference.length === 0) {
                if (context.referenceRef.current !== null) {
                    context.referenceRef.current.state.current = "Please fill in the Reference.";
                    this.setState({ message: "Please fill in the Reference." });
                    isValid = false;
                }
            }
            else if (reference.length > 0) {
                if (context.referenceRef.current !== null) {
                    context.referenceRef.current.state.current = "";
                    this.setState({ message: "" });
                    isValid = true;
                }
                if (taskReference !== reference) {
                    this.saveValue(updates, "reference", reference)
                }
            }
        }

        const heading = context.headingRef.current && context.headingRef.current.state.current;
        if (heading !== null && heading !== undefined) {
            if (heading.length === 0) {
                if (context.headingRef.current !== null) {
                    context.headingRef.current.state.current = "Please fill in the Reference.";
                    this.setState({ message: "Please fill in the Reference." });
                    isValid = false;
                }
            }
            else if (heading.length > 0) {
                if (context.headingRef.current !== null) {
                    context.headingRef.current.state.current = "";
                    this.setState({ message: "" });
                    isValid = true;
                }
                if (taskHeading !== heading) {
                    this.saveValue(updates, "heading", heading)
                }
            }
        }

        const assignedTo = context.assignedToRef.current && context.assignedToRef.current.state.current;
        if (assignedTo !== null && assignedTo !== undefined) {
            if (assignedTo.length === 0) {
                if (context.assignedToRef.current !== null) {
                    context.assignedToRef.current.state.current = "Please fill in the Reference.";
                    this.setState({ message: "Please fill in the Reference." });
                    isValid = false;
                }
            }
            else if (assignedTo.length > 0) {
                if (context.assignedToRef.current !== null) {
                    context.assignedToRef.current.state.current = "";
                    this.setState({ message: "" });
                    isValid = true;
                }
                if (taskAssignedTo !== assignedTo) {
                    this.saveValue(updates, "assignedTo", assignedTo)
                }
            }
        }

        if (isValid === true && updates.length > 0) {
            const query = '&' + updates.join('&');
            // tslint:disable-next-line:no-console
            console.log("/api/UpdateTask?task=" + theCurrentTask, "&project=" + selectedProject + query);
            updateTask(theCurrentTask, selectedProject, query)
        }
    }
}

interface IStateProps {
    selectedPopupTask: string;
    strings: IProjectSettingsStrings;
    tasks: ITask[];
    users: IUser[];
    selectedParatextProject: string;
    selectedProject: string;
};

const mapStateToProps = (state: IState): IStateProps => ({
    selectedParatextProject: state.paratextProjects.selectedParatextProject,
    selectedPopupTask: state.tasks.selectedPopupTask,
    selectedProject: state.tasks.selectedProject,
    strings: userStrings(state, { layout: "projectSettings" }),
    tasks: allTasks(state),
    users: state.users.users,
});

interface IDispatchProps {
    fetchUsers: typeof actions2.fetchUsers;
    selectPopupTask: typeof actions.selectPopupTask;
    updateTask: typeof actions.updateTask;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        fetchUsers: actions2.fetchUsers,
        selectPopupTask: actions.selectPopupTask,
        updateTask: actions.updateTask,
    }, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(TaskDetails);
import * as React from 'react';
import Avatar from 'react-avatar';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/taskActions';
import * as actions2 from '../actions/userActions';
import Duration from '../components/controls/Duration';
import { IProjectSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize'
import projectTasks from '../selectors/projectTasks';
import NextAction from './controls/NextAction';
import './TaskDetails.sass';
import FileField from './ui-controls/FileField';
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

const initialState = {
    assignedTo: "",
    fileName: "",
    fullPath: "",
    heading: "",
    reference: "",
}

class TaskDetails extends React.Component<IProps, typeof initialState> {
    public state = {...initialState};
    private original: typeof initialState;
    private taskId: string;
    private task: ITask;
    private fileRef: React.RefObject<FileField>;

    constructor(props: IProps) {
        super(props)
        this.updateAssignedTo = this.updateAssignedTo.bind(this);
        this.updateFileName = this.updateFileName.bind(this);
        this.updateHeading = this.updateHeading.bind(this);
        this.updateReference = this.updateReference.bind(this);
        this.fileRef = React.createRef();

        const { popupTask } = this.props;
        this.taskId = this.props.history.location.pathname.indexOf("NewTask") > 0 ? "" : popupTask;
        if (this.taskId && this.taskId !== "") {
            this.task = this.myTask(this.taskId);
            this.state.fileName = this.task.id
            const idParts = this.taskId.split('-');
            this.state.reference = ((idParts.length === 4)? idParts[1] + " " + Number(idParts[2]) + ":" + Number(idParts[3].slice(0,3)) + "-" + Number(idParts[3].slice(3,6)): "");
            this.state.heading = this.task.name?this.task.name:"";
            if (this.task.assignedto != null) {
                this.state.assignedTo = this.task.assignedto;
            }
        } else {
            this.task = {id:"", state:"Transcribe"}
            this.state = {...initialState}
        }
        this.original = {...this.state};
    }

    public render() {
        const { fileName, reference, heading, assignedTo } = this.state
        const { deleted, strings, users } = this.props;

        if (deleted) {
            return (<Redirect to="/ProjectSettings" />)
        }
        const userDisplayNames = users.map((u: IUser) => u.username.id + ":" + u.displayName);

        const deleteTask = () => this.deleteTask();
        const save = () => this.save(this);
        return (
            <div className="TaskDetails">
                <div className="closeRow">
                    <Link onClick={save} to="/ProjectSettings" >
                        <img src="/assets/close-x.svg" alt="X" />
                    </Link>
                </div>
                <div className="titleRow">
                    <div className="title">
                        <LabelCaptionUx name={strings.taskDetails} type="H2" />
                    </div>
                    <div className={"deleteButton" + (this.taskId !== ""? "": " hide")}>
                        <NextAction text={strings.delete} target={deleteTask} type="danger" />
                    </div>
                </div>
                <div className="details">
                    <div className="results">
                        <div className="resultsLeft">
                            <img src="/assets/waveform.png" className={fileName !== ""? "": "hide"} />
                            <div className="taskItemContent">
                                <div className="firstLine">
                                    <span className="displayReference">{reference}</span>
                                    <span className={"totalTime" + (fileName !== ""? "": " hide")}>
                                        <Duration seconds={this.duration()} />
                                    </span>
                                </div>
                                <div className="textName">{heading}</div>
                            </div>
                            <div className={"AvatarRow" + (assignedTo !== ""? "": " hide")}>
                                <Avatar name={this.displayName(assignedTo)} src={this.avatar(assignedTo)} size={64} round={true} />
                                <div className="AvatarCaption">{this.displayName(assignedTo)}</div>
                            </div>
                        </div>
                        <div className="resultsRight">
                            <div><FileField id="id1" caption={strings.audioFile} inputValue={fileName} onChange={this.updateFileName} ref={this.fileRef} /></div>
                            <div><TextField id="id2" caption={strings.reference} inputValue={reference} onChange={this.updateReference} /></div>
                            <div><TextField id="id3" caption={strings.heading} inputValue={heading} onChange={this.updateHeading}/></div>
                            <div><SelectField id="id4" caption={strings.assignedTo} selected={assignedTo} options={userDisplayNames} onChange={this.updateAssignedTo} /></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    private updateFileName(file: string) {
        this.setState({...this.state, fileName: file})
    }

    private updateHeading(header: string) {
        this.setState({...this.state, heading: header})
    }

    private updateReference(ref: string) {
        this.setState({...this.state, reference: ref})
    }

    private updateAssignedTo(userId: string) {
        this.setState({...this.state, assignedTo: userId})
    }

    private myTask(taskId: string): ITask {
        return this.props.tasks.filter(t => t.id === taskId)[0];
    }

    private duration(): number {
        return this.task && this.task.length? this.task.length: 0
    }

    private taskUser(userId: string): IUser {
        return this.props.users.filter((u: IUser) => u.username.id === userId)[0];
    }

    private displayName(userId: string): string {
        const user = this.taskUser(userId)
        return user? user.displayName: ""
    }

    private avatar(userId: string): string {
        const user = this.taskUser(userId)
        return user && user.username && user.username.avatarUri? user.username.avatarUri: ""
    }

    private saveValue(updates: string[], tag: string, val: string | null) {
        updates.push(tag + '=' + encodeURIComponent(val != null? val: ""))
    }

    private deleteTask() {
        const { deleteTask, popupTask } = this.props;
        return deleteTask(popupTask);
    }

    private save(ctx: TaskDetails) {
        const { selectedProject, updateTask } = this.props;

        const updates = Array<string>();
        let data: object = {}

        if (this.state.reference !== this.original.reference) {
            this.saveValue(updates, "reference", this.state.reference);
        }

        if (this.state.reference === "" && this.original.reference === "") {
            this.setState({...this.state, fileName: this.state.fileName.replace(" ","").replace("-","")})
        }

        if (this.state.fileName !== this.original.fileName) {
            this.saveValue(updates, "audioFile", this.state.fileName);
            data = {data: this.fileRef.current && this.fileRef.current.state.data}
        }

        if (this.state.heading !== this.original.heading) {
            this.saveValue(updates, "heading", this.state.heading);
        }

        if (this.state.assignedTo !== this.original.assignedTo) {
            this.saveValue(updates, "assignedTo", this.state.assignedTo)
        }

        if (updates.length > 0) {
            const query = '&' + updates.join('&');
            // tslint:disable-next-line:no-console
            console.log("/api/UpdateTask?task=" + this.taskId, '&project=' + selectedProject + query);
            updateTask(this.taskId, selectedProject, query, data);
        }
    }
}

interface IStateProps {
    deleted: boolean;
    popupTask: string;
    strings: IProjectSettingsStrings;
    tasks: ITask[];
    users: IUser[];
    selectedParatextProject: string;
    selectedProject: string;
};

const mapStateToProps = (state: IState): IStateProps => ({
    deleted: state.tasks.deleted,
    popupTask: state.tasks.selectedPopupTask,
    selectedParatextProject: state.paratextProjects.selectedParatextProject,
    selectedProject: state.tasks.selectedProject,
    strings: userStrings(state, { layout: "projectSettings" }),
    tasks: projectTasks(state),
    users: state.users.users,
});

interface IDispatchProps {
    deleteTask: typeof actions.deleteTask;
    fetchUsers: typeof actions2.fetchUsers;
    selectTask: typeof actions.selectTask;
    updateTask: typeof actions.updateTask;
 };
 const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
     ...bindActionCreators({
        deleteTask: actions.deleteTask,
        fetchUsers: actions2.fetchUsers,
        selectTask: actions.selectTask,
        updateTask: actions.updateTask,
     }, dispatch),
 });
export default connect(mapStateToProps,
    mapDispatchToProps
)(TaskDetails);
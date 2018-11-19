import * as React from 'react';
import Avatar from 'react-avatar';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/taskActions';
import * as actions2 from '../actions/userActions';
import { IProjectSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import uiDirection from '../selectors/direction';
import userStrings from '../selectors/localize';
import currentProject from '../selectors/project';
import projectTasks from '../selectors/projectTasks';
import BackLink from './controls/BackLink';
import NextAction from './controls/NextAction';
import TaskItem from './controls/TaskItem';
import './TaskDetails.sass';
import FileField from './ui-controls/FileField';
import IconButtonField from './ui-controls/IconButtonField';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';
import RangeSliderField from './ui-controls/RangeSliderField';
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
    discard: false,
    fileName: "",
    fullPath: "",
    heading: "",
    message: "",
    pair: false,
    reference: "",
    taskState: 0,
}

class TaskDetails extends React.Component<IProps, typeof initialState> {
    public state = {...initialState};
    private original: typeof initialState;
    private taskId: string;
    private task: ITask;
    private fileRef: React.RefObject<FileField>;

    constructor(props: IProps) {
        super(props)
        this.discard = this.discard.bind(this);
        this.updateAssignedTo = this.updateAssignedTo.bind(this);
        this.updateFileName = this.updateFileName.bind(this);
        this.updateHeading = this.updateHeading.bind(this);
        this.updateReference = this.updateReference.bind(this);
        this.fileRef = React.createRef();
        this.validateReference = this.validateReference.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.updateTaskState = this.updateTaskState.bind(this);

        const { popupTask } = this.props;
        this.taskId = this.props.history.location.pathname.indexOf("NewTask") > 0 ? "" : popupTask;
        if (this.taskId && this.taskId !== "") {
            this.task = this.myTask(this.taskId);
            this.state.fileName = this.task.id
            const idParts = this.taskId.split('-');
            this.state.reference = ((idParts.length === 4)? idParts[1] + " " + Number(idParts[2]) + ":" + Number(idParts[3].slice(0,3)) + "-" + Number(idParts[3].slice(3,6)): "");
            this.state.heading = this.task.name?this.task.name:"";
            this.state.taskState = this.task.state ? this.GetTaskStateIndex(this.task.state) : 0;
            if (this.task.assignedto != null) {
                this.state.assignedTo = this.task.assignedto;
            }
        } else {
            this.task = {id:"", state:"Transcribe"}
            this.state = {...initialState}
        }
        this.original = {...this.state};
    }

    public GetTaskStateIndex(currentState: string) {
        const { direction } = this.props;
        const totalTaskStateIndex = 3; // From 0 - 3
        if (currentState.toLowerCase() === "review") {
            return (direction && direction === "rtl"? totalTaskStateIndex - 1 : 1);
        }
        if (currentState.toLowerCase() === "upload") {
            return (direction && direction === "rtl"? totalTaskStateIndex - 2 : 2);
        }
        if (currentState.toLowerCase() === "complete") {
            return (direction && direction === "rtl"? totalTaskStateIndex - 3 : 3);
        }
        else {
            return (direction && direction === "rtl"? totalTaskStateIndex - 0 : 0);
        }
    }

    public render() {
        const { discard, fileName, reference, heading, assignedTo, taskState } = this.state
        const { direction, deleted, strings, users } = this.props;

        if (deleted || discard) {
            return (<Redirect to="/ProjectSettings" />)
        }
        const userDisplayNames = users.map((u: IUser) => u.username.id + ":" + u.displayName);
        // const deleteTask = () => this.deleteTask();
        const save = () => this.save(this);
        const copyToClipboard = () => this.copyToClipboard();
        const marks = (direction && direction === "rtl"?
        {3:{label: strings.start,style:{color:'#F5CC4C',}},2:{label: strings.transcribed,style:{color:'#C7DE31',}},1:{label:strings.reviewed,style:{color:'#C7DE31',}},0:{label: strings.synced,style:{color:'#C7DE31',}},}
        :
        {0:{label: strings.start,style:{color:'#F5CC4C',}},1:{label: strings.transcribed,style:{color:'#C7DE31',}},2:{label:strings.reviewed,style:{color:'#C7DE31',}},3:{label: strings.synced,style:{color:'#C7DE31',}},})
        return (
            <div className={"TaskDetails " + (direction && direction === "rtl"? "rtl": "ltr")}>
                <div className="panel">
                    <div className="titleRow">
                        <BackLink action={save} target="/ProjectSettings" />
                        <div className="title">
                            <LabelCaptionUx name={strings.taskDetails} type="H2" />
                        </div>
                        <div className="copyAction">
                            <NextAction text={strings.copyToClipboard} target={copyToClipboard} type="safe" />
                        </div>
                    </div>
                    <div className="data">
                        <div><FileField id="id1" caption={strings.audioFile} inputValue={fileName} onChange={this.updateFileName} ref={this.fileRef} /></div>
                        <div><TextField id="id2" caption={strings.reference} inputValue={reference} onChange={this.updateReference} onBlur={this.validateReference} message={this.state.message}/></div>
                        <div><TextField id="id3" caption={strings.heading} inputValue={heading} onChange={this.updateHeading}/></div>
                        <div><SelectField id="id4" caption={strings.assignedTo} selected={assignedTo} options={userDisplayNames} onChange={this.updateAssignedTo} /></div>
                    </div>
                    <div className="preview">
                        <LabelCaptionUx name={strings.preview} type="small" />
                        <div className={"waveformRow" + (fileName !== "" || heading !== "" || reference !== ""? "": " hide")}>
                            <TaskItem id="TaskItem" length={this.duration()} name={heading} reference={reference} selected={true} />
                            <div className={"selectBar" + (fileName !== ""? "": " hide")}>{"\u00A0"}</div>
                        </div>
                        <div className={"AvatarRow" + (assignedTo !== ""? "": " hide")}>
                            <Avatar name={this.displayName(assignedTo)} src={this.avatar(assignedTo)} size={64} round={true} />
                            <div className="AvatarCaption">{this.displayName(assignedTo)}</div>
                        </div>
                    </div>
                    <div className="slider">
                        <div><RangeSliderField id="Slider1" marks={marks} caption={strings.milestones} onChange={this.updateTaskState} selected={taskState} /></div>
                    </div>
                    <div className="action">
                        <IconButtonField id="discard" caption="Discard changes" imageUrl="CancelIcon.svg" onClick={this.discard}/>
                        <IconButtonField caption="Delete task" imageUrl="RejectIcon.svg" onClick={this.deleteTask}/>
                    </div>
                </div>
            </div>
        )
    }

    private validateReference(ref: string) {
        const { project, strings } = this.props;
        const pair = project && project.guid && project.guid !== ""? true: false
        if (pair) {
            const refExpr = /^\w{1,3}\s{1}\d{1,3}(\.|:){1}\d{1,3}(-|,)\d{1,3}$/;
            this.setState({message: refExpr.test(ref)? "" : strings.referenceFormat});
        }
    }

    private discard(){
        this.setState({...this.state, discard:true})
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

    private updateTaskState(selectedState: number) {
        const { direction } = this.props;
        const totalTaskStateIndex = 3; // From 0 - 3
        this.setState({ ...this.state, taskState: (direction && direction === "rtl"? totalTaskStateIndex - selectedState : selectedState) })
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

    private copyToClipboard() {
        const { copyToClipboard, popupTask } = this.props;
        copyToClipboard(popupTask);
    }

    private save(ctx: TaskDetails) {
        const { direction, selectedProject, updateTask } = this.props;

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

        if (this.state.taskState !==  (direction && direction === "rtl"? 3 - this.original.taskState : this.original.taskState)) {
            this.saveValue(updates, "state", this.state.taskState.toString())
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
    direction: string;
    popupTask: string;
    project: IProject;
    strings: IProjectSettingsStrings;
    tasks: ITask[];
    users: IUser[];
    selectedParatextProject: string;
    selectedProject: string;
};

const mapStateToProps = (state: IState): IStateProps => ({
    deleted: state.tasks.deleted,
    direction: uiDirection(state),
    popupTask: state.tasks.selectedPopupTask,
    project: currentProject(state),
    selectedParatextProject: state.paratextProjects.selectedParatextProject,
    selectedProject: state.tasks.selectedProject,
    strings: userStrings(state, { layout: "projectSettings" }),
    tasks: projectTasks(state),
    users: state.users.users,
});

interface IDispatchProps {
    copyToClipboard: typeof actions.copyToClipboard;
    deleteTask: typeof actions.deleteTask;
    fetchUsers: typeof actions2.fetchUsers;
    selectTask: typeof actions.selectTask;
    updateTask: typeof actions.updateTask;
 };
 const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
     ...bindActionCreators({
        copyToClipboard: actions.copyToClipboard,
        deleteTask: actions.deleteTask,
        fetchUsers: actions2.fetchUsers,
        selectTask: actions.selectTask,
        updateTask: actions.updateTask,
     }, dispatch),
 });
export default connect(mapStateToProps,
    mapDispatchToProps
)(TaskDetails);
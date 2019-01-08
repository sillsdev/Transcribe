import * as React from 'react';
import Avatar from 'react-avatar';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as actions3 from '../actions/audioActions';
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
import AnchorHelp from './ui-controls/AnchorHelp';
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
    previewHeight: 0,
    reference: "",
    taskState: 0,
}

class TaskDetails extends React.Component<IProps, typeof initialState> {
    public state = {...initialState};
    private original: typeof initialState;
    private taskId: string;
    private task: ITask;
    private fileRef: React.RefObject<FileField>;
    private previewRef: React.RefObject<HTMLDivElement>;

    constructor(props: IProps) {
        super(props)
        this.discard = this.discard.bind(this);
        this.updateAssignedTo = this.updateAssignedTo.bind(this);
        this.updateFileName = this.updateFileName.bind(this);
        this.updateHeading = this.updateHeading.bind(this);
        this.updateReference = this.updateReference.bind(this);
        this.fileRef = React.createRef();
        this.previewRef = React.createRef();
        this.validateReference = this.validateReference.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.updateTaskState = this.updateTaskState.bind(this);

        const { popupTask, project } = this.props;
        this.taskId =  this.props.history.location.pathname.indexOf("NewTask") > 0? "" : popupTask;
        if (this.taskId && this.taskId !== "") {
            this.task = this.myTask(this.taskId);
            if(this.task.id.toUpperCase().endsWith(".MP3") || this.task.id.toUpperCase().endsWith(".WAV")){
                this.state.fileName = this.task.id;
            }
            const pair = project && project.guid && project.guid !== "" ? true : false
            if(!pair){
                if(this.task.reference && this.task.reference !== ""){
                    this.state.reference = this.task.reference;
                }
            }
            else{
                const idParts = this.taskId.split('-');
                this.state.reference = ((idParts.length === 4)? idParts[1] + " " + Number(idParts[2]) + ":" + Number(idParts[3].slice(0,3)) + "-" + Number(idParts[3].slice(3,6)): "");
            }

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
        const marks = this.GetRangeSliderMarks();
         // 4 marks in range-slider {0 - 3}
        for(let i=0; i<= 3; i++) {
            if(marks[i].text === currentState) {
                return i;
            }
        }
        return 0;
    }

    public componentDidMount () {
        const newTask = this.props.history.location.pathname.indexOf("NewTask") > 0;
        const previewLocation = this.previewRef && this.previewRef.current && this.previewRef.current.offsetTop
            ? this.previewRef.current.offsetTop
            : 0;
        this.setState({previewHeight: window.innerHeight - previewLocation - (!newTask? 180: 52)})
    }

    public render() {
        const { discard, fileName, reference, heading, assignedTo, taskState } = this.state
        const { direction, deleted, strings, users } = this.props;

        if (deleted || discard) {
            return (<Redirect to="/ProjectSettings" />)
        }
        const newTask = this.props.history.location.pathname.indexOf("NewTask") > 0;
        const userDisplayNames = users.map((u: IUser) => u.username.id + ":" + u.displayName);
        const save = () => this.save(this);
        const copyToClipboard = () => this.copyToClipboard();
        let backLinkWrapper;
        if(this.state.message === "" && this.state.reference !== ""){
            backLinkWrapper = (<BackLink action={save} target="/ProjectSettings" />);
        }
        else{
            backLinkWrapper = (<BackLink action={save} target="/ProjectSettings" disable={true} />)
        }

        return (
            <div className={"TaskDetails " + (direction && direction === "rtl"? "rtl": "ltr")}>
                <div className="panel">
                    <div className="titleRow">
                        {backLinkWrapper}
                        <div className="title">
                            <LabelCaptionUx name={strings.taskDetails} type="H2" />
                        </div>
                        <div className="anchorHelp">
                                <AnchorHelp id="ProjSettingsHelp" onClick={this.ShowTaskDetailsHelp} />
                        </div>
                        <div className={"copyAction" + (newTask? " hide": "")}>
                            <NextAction
                                text={strings.copyToClipboard}
                                target={copyToClipboard}
                                type="safe" />
                        </div>
                    </div>
                    <div className="data">
                        <div><FileField id="id1"
                            caption={strings.audioFile}
                            inputValue={fileName}
                            onChange={this.updateFileName}
                            ref={this.fileRef} /></div>
                        <div><TextField id="id2"
                            caption={strings.reference}
                            inputValue={reference}
                            onChange={this.updateReference}
                            onBlur={this.validateReference}
                            message={this.state.message}/></div>
                        <div><TextField id="id3"
                            caption={strings.heading}
                            inputValue={heading}
                            onChange={this.updateHeading}/></div>
                        <div><SelectField id="id4"
                            caption={strings.assignedTo}
                            selected={assignedTo}
                            options={userDisplayNames}
                            onChange={this.updateAssignedTo}
                            direction={direction} /></div>
                    </div>
                    <div className="preview" ref={this.previewRef} style={{maxHeight: this.state.previewHeight}}>
                        <LabelCaptionUx name={strings.preview} type="small" />
                        <div className={"waveformRow" + (fileName !== "" || heading !== "" || reference !== ""? "": " hide") + (fileName !== ""? "": " hideWave")}>
                            <TaskItem id="TaskItem"
                                length={this.duration()} name={heading}
                                reference={reference}
                                selected={true} />
                            <div className={"selectBar" + (fileName !== ""? "": " hide")}>{"\u00A0"}</div>
                        </div>
                        <div className={"AvatarRow" + (assignedTo !== ""? "": " hide")}>
                            <Avatar
                                name={this.displayName(assignedTo)}
                                src={this.avatar(assignedTo)}
                                size={64}
                                round={true} />
                            <div className="AvatarCaption">{this.displayName(assignedTo)}</div>
                        </div>
                    </div>
                    <div className={"slider" + (newTask? " hide": "")}>
                        <div><RangeSliderField id="Slider1"
                            marks={this.GetRangeSliderMarks()}
                            caption={strings.milestones}
                            onChange={this.updateTaskState}
                            selected={taskState} /></div>
                    </div>
                    <div className="action">
                        <IconButtonField id="discard"
                            caption={strings.discardChanges}
                            imageUrl="CancelIcon.svg"
                            onClick={this.discard}/>
                        <IconButtonField id={"deleteTask" + (newTask? "Hide": "")}
                            caption={strings.deleteTask}
                            imageUrl="RejectIcon.svg"
                            onClick={this.deleteTask}/>
                    </div>
                </div>
            </div>
        )
    }

    public GetRangeSliderMarks()
    {
        const { direction, strings } = this.props;
        const greenColor = "#C7DE31"
        const firstIndex = direction && direction === "rtl"? {label:strings.synced,style:{color:greenColor},text:"Complete"}: {label:strings.start,style:{color:greenColor},text:"Transcribe"};
        const secondIndex = direction && direction === "rtl"? {label:strings.reviewed,style:{color:greenColor},text:"Upload"}: {label:strings.transcribed,style:{color:greenColor},text:"Review"};
        const thirdIndex = direction && direction === "rtl"? {label:strings.transcribed,style:{color:greenColor},text:"Review"}: {label:strings.reviewed,style:{color:greenColor},text:"Upload"};
        const fourthIndex = direction && direction === "rtl"? {label:strings.start,style:{color:greenColor},text:"Transcribe"}: {label:strings.synced,style:{color:greenColor},text:"Complete"};
        return {0: firstIndex,1: secondIndex,2: thirdIndex,3: fourthIndex};
    }

    private ShowTaskDetailsHelp = () => {
        this.props.showHelp("Edit task details")
    }

    private validateReference(ref: string) {
        const { project, strings } = this.props;
        let errorMessage = "";
        const pair = project && project.guid && project.guid !== "" ? true : false
        if (pair) {
            const refExpr = /^\w{1,3}\s{1}\d{1,3}(\.|:){1}\d{1,3}(-|,)\d{1,3}$/;
            errorMessage = refExpr.test(ref) ? "" : strings.referenceFormat;
            this.setState({ message: errorMessage });
            if (errorMessage === "" && this.taskId === "") {
                let taskExists = false;
                taskExists = this.checkForTaskExistence();
                this.setState({ message: taskExists ? strings.referenceDuplicate:"" });
            }
        }
        else{
            this.setState({ message: "" });
        }
    }

    private discard(){
        this.setState({...this.state, discard:true})
    }

    private updateFileName(file: string, data: string) {
        this.setState({...this.state, fileName: file})
        this.props.fetchMeta(file, {data});
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
        this.setState({ ...this.state, taskState: selectedState })
    }

    private myTask(taskId: string): ITask {
        return this.props.tasks.filter(t => t.id === taskId)[0];
    }

    private duration(): number {
        return this.props.size
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
            this.saveValue(updates, "timeDuration", this.props.size.toString())
        }

        if (this.state.heading !== this.original.heading) {
            this.saveValue(updates, "heading", this.state.heading);
        }

        if (this.state.assignedTo !== this.original.assignedTo) {
            this.saveValue(updates, "assignedTo", this.state.assignedTo)
        }

        if (this.state.taskState !==  this.original.taskState) {
            const marks = this.GetRangeSliderMarks();
            this.saveValue(updates, "state", marks[this.state.taskState].text)
        }

        if (updates.length > 0) {
            const query = '&' + updates.join('&');
            // tslint:disable-next-line:no-console
            console.log("/api/UpdateTask?task=" + this.taskId, '&project=' + selectedProject + query);
            updateTask(this.taskId, selectedProject, query, data);
        }
    }

    private checkForTaskExistence(): boolean {
        const { tasks } = this.props;
        const taskIdsArray = Array<string>();
        let idParts;
        let reference = "";
        let isExists = false;
        if (tasks.length > 0) {
            tasks.map((t: ITask) => (
                idParts = t.id.split("-"),
                reference = ((idParts.length === 4) ? idParts[1].toUpperCase() + " " + Number(idParts[2]) + ":" + Number(idParts[3].slice(0, 3)) + "-" + Number(idParts[3].slice(3, 6)) : ""),
                taskIdsArray.push(reference)
            ));

            const existingValue = taskIdsArray.find((str) => (str === this.state.reference.toUpperCase() ||
                str.replace("-", ",") === this.state.reference.toUpperCase() ||
                str.replace(":", ".") === this.state.reference.toUpperCase()||
                str.replace(":", ".").replace("-", ",") === this.state.reference.toUpperCase()))

            if (existingValue !== undefined) {
                isExists = true;
            }
        }
        return isExists;
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
    size: number;
};

const mapStateToProps = (state: IState): IStateProps => ({
    deleted: state.tasks.deleted,
    direction: uiDirection(state),
    popupTask: state.tasks.selectedPopupTask,
    project: currentProject(state),
    selectedParatextProject: state.paratextProjects.selectedParatextProject,
    selectedProject: state.tasks.selectedProject,
    size: state.meta.size,
    strings: userStrings(state, { layout: "projectSettings" }),
    tasks: projectTasks(state),
    users: state.users.users,
});

interface IDispatchProps {
    copyToClipboard: typeof actions.copyToClipboard;
    deleteTask: typeof actions.deleteTask;
    fetchMeta: typeof actions3.fetchMeta;
    fetchUsers: typeof actions2.fetchUsers;
    selectTask: typeof actions.selectTask;
    updateTask: typeof actions.updateTask;
    showHelp: typeof actions.showHelp,
 };
 const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
     ...bindActionCreators({
        copyToClipboard: actions.copyToClipboard,
        deleteTask: actions.deleteTask,
        fetchMeta: actions3.fetchMeta,
        fetchUsers: actions2.fetchUsers,
        selectTask: actions.selectTask,
        showHelp: actions.showHelp,
        updateTask: actions.updateTask,
     }, dispatch),
 });
export default connect(mapStateToProps,
    mapDispatchToProps
)(TaskDetails);
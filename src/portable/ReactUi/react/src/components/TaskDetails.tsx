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

class TaskDetails extends React.Component<IProps, object> {
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

        if(theCurrentTask !== "")
        {
            task =tasks.filter(t => t.id === theCurrentTask)[0];
            const idParts = theCurrentTask.split('-');
            displayReference = displayId = ((idParts.length === 4)? idParts[1] + " " + Number(idParts[2]) + ":" + Number(idParts[3].slice(0,3)) + "-" + Number(idParts[3].slice(3,6)): "")
            taskAudioFile = task.id;
            taskReference = displayId;
            displayHeading = taskHeading = task.name;
            taskAssignedTo = task.assignedto;
            const taskUser = users.filter(u => u.username.id = taskAssignedTo)[0];
            displayUserName = taskAssignedTo = taskUser.displayName;
            displayUserAvatarUri = taskUser.username.avatarUri;
            displayDuration = task.length? task.length : 0
        }

        return (
            <div className="TaskDetails">
                <div className="closeRow">
                    <Link to="/ProjectSettings">
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
                            <div><TextField id="id1" caption="Audio File" inputValue={taskAudioFile} isReadOnly={false} /></div>
                            <div><TextField id="id2" caption="Reference" inputValue={taskReference} isReadOnly={true} /></div>
                            <div><TextField id="id3" caption="Heading" inputValue={taskHeading}/></div>
                            <div><SelectField id="id4" caption="Assigned To" selected={taskAssignedTo} options={users} /></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

interface IStateProps {
    selectedPopupTask: string;
    strings: IProjectSettingsStrings;
    tasks: ITask[];
    users: IUser[];
};

const mapStateToProps = (state: IState): IStateProps => ({
    selectedPopupTask: state.tasks.selectedPopupTask,
    strings: userStrings(state, { layout: "projectSettings" }),
    tasks: allTasks(state),
    users: state.users.users,
});

interface IDispatchProps {
    fetchUsers: typeof actions2.fetchUsers;
    selectPopupTask: typeof actions.selectPopupTask;
 };
 const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
     ...bindActionCreators({
        fetchUsers: actions2.fetchUsers,
        selectPopupTask: actions.selectPopupTask,
     }, dispatch),
 });
export default connect(mapStateToProps,
    mapDispatchToProps
)(TaskDetails);
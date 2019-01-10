import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { log } from '../actions/logAction';
import * as actions from '../actions/taskActions';
import { ITranscriberStrings } from '../model/localize';
import { IState } from '../model/state';
import taskList from '../selectors';
import uiDirection from '../selectors/direction';
import userStrings from '../selectors/localize';
import userValue from '../selectors/user';
import RevertAction from './controls/RevertAction';
import TaskItem from './controls/TaskItem';
import './TaskPanel.sass';

interface IProps extends IStateProps, IDispatchProps {
};

class TaskPanel extends React.Component<IProps, object> {
      public render() {
        const { assignedReview, assignedTranscribe, availableReview, availableTranscribe } = this.props;
        const { inProgressTasks, transcribedTasks, reviewedTasks, syncedTasks, selectedOption, allTasks, syncedOtherTasks, reviewedOtherTasks, transcribedOtherTasks } = this.props;
        const { lastTask, loaded, pending, selectedUser, selectedTask, users } = this.props;
        const { assignTask, direction, selectTask, strings, unassignTask } = this.props

        log("TaskPanel")
        const user = users.filter(u => u.username.id === selectedUser)[0];
        const userRole = user.role.filter(r => r === "reviewer" || r === "administrator")[0];
        const selectReview = assignedReview.filter(t => t.id === lastTask);
        const selectTranscribe = assignedTranscribe.filter(t => t.id === lastTask)
        if (this.props.selectedTask.trim() === '' && lastTask != null && selectReview.length + selectTranscribe.length > 0 && this.ValidateSelectedOption){
            selectTask(selectedUser, lastTask)
        }
        const headStyle = direction? "ListHead " + direction: "ListHead";
        const assignedHead = (selectedOption.toLowerCase() === "mytasks" && assignedReview.length + assignedTranscribe.length > 0)?
        (<h3 className="SectionHead">{strings.assigned}</h3>): <div/>;
        const assignedReviewHead = (selectedOption.toLowerCase() === "mytasks" && assignedReview.length) > 0?
        (<h4 className={headStyle}>{strings.review.toUpperCase()}</h4>): <div/>;
        const assignedTranscribeHead = (selectedOption.toLowerCase() === "mytasks" && assignedTranscribe.length) > 0?
        (<h4 className={headStyle}>{strings.transcribe.toUpperCase()}</h4>): <div/>;
        const assignedReviewList = (selectedOption.toLowerCase() === "mytasks" && assignedReview.length > 0)? assignedReview.map((t: ITask) => (
        <div className="AssignedRow">
            <RevertAction
                id={"Revert" + t.id}
                selected={true}
                strings={strings}
                target={unassignTask.bind(this, t.id, selectedUser)} />
            <TaskItem
                id={t.id}
                direction={direction}
                name={t.name?t.name:""}
                length={t.length != null? t.length: 0}
                selected={t.id === selectedTask}
                select={this.ValidateSelectedOption? selectTask.bind(this,selectedUser, t.id): ""}/>
            <div className={t.id === selectedTask? "selectBar": "placeHolder"}>{"\u00A0"}</div>
        </div>
        )):<div/>;
        const assignedTranscribeList = (selectedOption.toLowerCase() === "mytasks" && assignedTranscribe.length > 0)? assignedTranscribe.map((t: ITask) => (
        <div className="AssignedRow">
            <RevertAction
                id={"Revert" + t.id}
                selected={true}
                strings={strings}
                target={unassignTask.bind(this, t.id, selectedUser)} />
            <TaskItem
                id={t.id}
                direction={direction}
                name={t.name?t.name:""}
                length={t.length != null? t.length: 0}
                selected={t.id === selectedTask}
                select={this.ValidateSelectedOption? selectTask.bind(this,selectedUser, t.id): ""}/>
            <div className={t.id === selectedTask? "selectBar": "placeHolder"}>{"\u00A0"}</div>
        </div>
        )):<div/>;
        const availableHead = (selectedOption.toLowerCase() === "mytasks" && availableTranscribe.length + availableReview.length > 0)?
        (<h3 className="SectionHead">{strings.available}</h3>): <div/>;
        const availableReviewHead = (selectedOption.toLowerCase() === "mytasks" && availableReview.length > 0 && userRole !== undefined)?
        (<h4 className={headStyle}>{strings.review.toUpperCase()}</h4>): <div/>;
        const availableTranscribeHead = (selectedOption.toLowerCase() === "mytasks" && availableTranscribe.length > 0)?
        (<h4 className={headStyle}>{strings.transcribe.toUpperCase()}</h4>): <div/>;
        const availableReviewList = (selectedOption.toLowerCase() === "mytasks" && availableReview.length > 0 && userRole !== undefined)? availableReview.map((t: ITask) => (
        <div className="AvailableRow">
            <div className="placeHolder">{"\u00A0"}</div>
            <TaskItem
                id={t.id}
                direction={direction}
                name={t.name?t.name:""}
                length={t.length != null? t.length: 0}
                selected={t.id === selectedTask}
                select={this.ValidateSelectedOption? assignTask.bind(this,t.id, selectedUser): ""}/>
            <div className="placeHolder">{"\u00A0"}</div>
        </div>
        )):<div/>;
        const availableTranscribeList = (selectedOption.toLowerCase() === "mytasks" && availableTranscribe.length > 0)? availableTranscribe.map((t: ITask) => (
        <div className="AvailableRow">
            <div className="placeHolder">{"\u00A0"}</div>
            <TaskItem
                id={t.id}
                direction={direction}
                name={t.name?t.name:""}
                length={t.length != null? t.length: 0}
                selected={t.id === selectedTask}
                select={this.ValidateSelectedOption? assignTask.bind(this,t.id, selectedUser): ""}/>
            <div className="placeHolder">{"\u00A0"}</div>
        </div>
        )):<div/>;
        const inprogressHead = (selectedOption.toLowerCase() === "inprogress" && inProgressTasks.length > 0)?
            (<h3 className="SectionHead">{strings.inprogress}</h3>): <div/>;
        const inprogressTaskList = (selectedOption.toLowerCase() === "inprogress" && inProgressTasks.length > 0)? inProgressTasks.map((t: ITask) => (
            <div className="AvailableRow">
                <div className="placeHolder">{"\u00A0"}</div>
                <TaskItem
                    id={t.id}
                    direction={direction}
                    name={t.name?t.name:""}
                    length={t.length != null? t.length: 0}
                    selected={t.id === selectedTask}
                    select={this.ValidateSelectedOption? assignTask.bind(this,t.id, selectedUser): ""}/>
                <div className="placeHolder">{"\u00A0"}</div>
            </div>
        )):<div/>;
        const transcribedHead = (selectedOption.toLowerCase() === "transcribed" && (transcribedTasks.length + transcribedOtherTasks.length) > 0)?
            (<h3 className="SectionHead">{strings.transcribed}</h3>): <div/>;
        const transcribedTaskList = (selectedOption.toLowerCase() === "transcribed" && transcribedTasks.length > 0)? transcribedTasks.map((t: ITask) => (
            <div className="AvailableRow">
                <div className="placeHolder">{"\u00A0"}</div>
                <TaskItem
                    id={t.id}
                    direction={direction}
                    name={t.name?t.name:""}
                    length={t.length != null? t.length: 0}
                    selected={t.id === selectedTask}
                    select={this.ValidateSelectedOption? assignTask.bind(this,t.id, selectedUser): ""}/>
                <div className="placeHolder">{"\u00A0"}</div>
            </div>
        )):<div/>;
        const transcribedOtherTaskList = (selectedOption.toLowerCase() === "transcribed" && transcribedOtherTasks.length > 0)? transcribedOtherTasks.map((t: ITask) => (
            <div className="AvailableRow">
                <div className="placeHolder">{"\u00A0"}</div>
                <TaskItem
                    id={t.id}
                    direction={direction}
                    name={t.name?t.name:""}
                    length={t.length != null? t.length: 0}
                    selected={t.id === selectedTask}
                    select={this.ValidateSelectedOption? assignTask.bind(this,t.id, selectedUser): ""}/>
                <div className="placeHolder">{"\u00A0"}</div>
            </div>
        )):<div/>;
        const reviewedHead = (selectedOption.toLowerCase() === "reviewed" && (reviewedTasks.length + reviewedOtherTasks.length) > 0)?
        (<h3 className="SectionHead">{strings.reviewed}</h3>): <div/>;
        const reviewedTaskList = (selectedOption.toLowerCase() === "reviewed" && reviewedTasks.length > 0)? reviewedTasks.map((t: ITask) => (
        <div className="AvailableRow">
            <div className="placeHolder">{"\u00A0"}</div>
            <TaskItem
                id={t.id}
                direction={direction}
                name={t.name?t.name:""}
                length={t.length != null? t.length: 0}
                selected={t.id === selectedTask}
                select={this.ValidateSelectedOption? assignTask.bind(this,t.id, selectedUser): ""}/>
            <div className="placeHolder">{"\u00A0"}</div>
        </div>
        )):<div/>;
        const reviewedOtherTaskList = (selectedOption.toLowerCase() === "reviewed" && reviewedOtherTasks.length > 0)? reviewedOtherTasks.map((t: ITask) => (
            <div className="AvailableRow">
                <div className="placeHolder">{"\u00A0"}</div>
                <TaskItem
                    id={t.id}
                    direction={direction}
                    name={t.name?t.name:""}
                    length={t.length != null? t.length: 0}
                    selected={t.id === selectedTask}
                    select={this.ValidateSelectedOption? assignTask.bind(this,t.id, selectedUser): ""}/>
                <div className="placeHolder">{"\u00A0"}</div>
            </div>
        )):<div/>;
        const syncedHead = (selectedOption.toLowerCase() === "synced" && (syncedTasks.length + syncedOtherTasks.length) > 0)?
        (<h3 className="SectionHead">{strings.synced}</h3>): <div/>;
        const syncedTaskList = (selectedOption.toLowerCase() === "synced" && syncedTasks.length > 0)? syncedTasks.map((t: ITask) => (
        <div className="AvailableRow">
            <div className="placeHolder">{"\u00A0"}</div>
            <TaskItem
                id={t.id}
                direction={direction}
                name={t.name?t.name:""}
                length={t.length != null? t.length: 0}
                selected={t.id === selectedTask}
                select={this.ValidateSelectedOption? assignTask.bind(this,t.id, selectedUser): ""}/>
            <div className="placeHolder">{"\u00A0"}</div>
        </div>
        )):<div/>;
        const syncedOtherTaskList = (selectedOption.toLowerCase() === "synced" && syncedOtherTasks.length > 0)? syncedOtherTasks.map((t: ITask) => (
            <div className="AvailableRow">
                <div className="placeHolder">{"\u00A0"}</div>
                <TaskItem
                    id={t.id}
                    direction={direction}
                    name={t.name?t.name:""}
                    length={t.length != null? t.length: 0}
                    selected={t.id === selectedTask}
                    select={this.ValidateSelectedOption? assignTask.bind(this,t.id, selectedUser): ""}/>
                <div className="placeHolder">{"\u00A0"}</div>
            </div>
            )):<div/>;
        const allTasksHead = (selectedOption.toLowerCase() === "alltasks" && allTasks.length > 0)?
        (<h3 className="SectionHead">{strings.alltasks}</h3>): <div/>;
        const allTaskList = (selectedOption.toLowerCase() === "alltasks" && allTasks.length > 0)? allTasks.map((t: ITask) => (
        <div className="AvailableRow">
            <div className="placeHolder">{"\u00A0"}</div>
            <TaskItem
                id={t.id}
                direction={direction}
                name={t.name?t.name:""}
                length={t.length != null? t.length: 0}
                selected={t.id === selectedTask}
                select={this.ValidateSelectedOption? assignTask.bind(this,t.id, selectedUser): ""}/>
            <div className="placeHolder">{"\u00A0"}</div>
        </div>
        )):<div/>;
        const wrapper: JSX.Element = !pending && loaded? (
            <div>
                {assignedHead}
                {assignedReviewHead}
                {assignedReviewList}
                {assignedTranscribeHead}
                {assignedTranscribeList}
                {availableHead}
                {availableReviewHead}
                {availableReviewList}
                {availableTranscribeHead}
                {availableTranscribeList}
                {inprogressHead}
                {inprogressTaskList}
                {transcribedHead}
                {transcribedTaskList}
                {transcribedOtherTaskList}
                {reviewedHead}
                {reviewedTaskList}
                {reviewedOtherTaskList}
                {syncedHead}
                {syncedTaskList}
                {syncedOtherTaskList}
                {allTasksHead}
                {allTaskList}
            </div>
        ): <div/>;
        return (
            <div className="TaskPanel">
                {wrapper}
            </div>
        )
    }

    private ValidateSelectedOption()
    {
        const { selectedOption } = this.props;
        if(selectedOption !== undefined && selectedOption.toLowerCase() === "mytasks") {
            return true;
        }
        else {
            return false;
        }
    }
};

interface IStateProps {
    allTasks: ITask[];
    assignedReview: ITask[];
    assignedTranscribe: ITask[];
    availableReview: ITask[];
    availableTranscribe: ITask[];
    direction: string;
    lastTask: string | undefined;
    loaded: boolean;
    pending: boolean;
    selectedUser: string;
    selectedTask: string;
    strings: ITranscriberStrings;
    selectedOption: string;
    inProgressTasks: ITask[];
    transcribedTasks: ITask[];
    transcribedOtherTasks: ITask[];
    reviewedTasks: ITask[];
    reviewedOtherTasks: ITask[];
    syncedTasks: ITask[];
    syncedOtherTasks: ITask[];
    users: IUser[];
}

const mapStateToProps = (state: IState): IStateProps => ({
    allTasks: taskList(state).allTasks,
    assignedReview: taskList(state).assignedReview,
    assignedTranscribe: taskList(state).assignedTranscribe,
    availableReview: taskList(state).availableReview,
    availableTranscribe: taskList(state).availableTranscribe,
    direction: uiDirection(state),
    inProgressTasks: taskList(state).inProgressTasks,
    lastTask: userValue(state),
    loaded: state.tasks.loaded,
    pending: state.tasks.pending,
    reviewedOtherTasks: taskList(state).reviewedOtherTasks,
    reviewedTasks: taskList(state).reviewedTasks,
    selectedOption: state.tasks.selectedOption,
    selectedTask: state.tasks.selectedTask,
    selectedUser: state.users.selectedUser,
    strings: userStrings(state, {layout: "transcriber"}),
    syncedOtherTasks: taskList(state).syncedOtherTasks,
    syncedTasks: taskList(state).syncedTasks,
    transcribedOtherTasks: taskList(state).transcribedOtherTasks,
    transcribedTasks: taskList(state).transcribedTasks,
    users: state.users.users,
  });
  
  interface IDispatchProps {
    assignTask: typeof actions.assignTask;
    selectTask: typeof actions.selectTask;
    unassignTask: typeof actions.unAssignTask;
  };
  
  const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        assignTask: actions.assignTask,
        selectTask: actions.selectTask,
        unassignTask: actions.unAssignTask,
        }, dispatch),
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(TaskPanel);
  
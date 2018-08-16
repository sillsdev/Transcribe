import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/taskActions';
import { ITranscriberStrings } from '../model/localize';
import { IState } from '../model/state';
import taskList from '../selectors';
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
        const { lastTask, loaded, pending, selectedUser, selectedTask } = this.props;
        const { assignTask, selectTask, strings, unassignTask } = this.props

        const selectReview = assignedReview.filter(t => t.id === lastTask);
        const selectTranscribe = assignedTranscribe.filter(t => t.id === lastTask)
        if (this.props.selectedTask.trim() === '' && lastTask != null && selectReview.length + selectTranscribe.length > 0){
            selectTask(selectedUser, lastTask)
        }
        else if (this.props.selectedTask.trim() === '' && this.props.assignedReview.length > 0) {
            selectTask(selectedUser, assignedReview[0].id);
        }
        else if (this.props.selectedTask.trim() === '' && this.props.assignedTranscribe.length > 0) {
            selectTask(selectedUser, assignedTranscribe[0].id);
        }
        const assignedHead = (assignedReview.length + assignedTranscribe.length > 0)?
            (<h3 className="SectionHead">{strings.assigned}</h3>): <div/>;
        const assignedReviewHead = assignedReview.length > 0?
            (<h4 className="ListHead">{strings.review.toUpperCase()}</h4>): <div/>;
        const assignedTranscribeHead = assignedTranscribe.length > 0?
            (<h4 className="ListHead">{strings.transcribe.toUpperCase()}</h4>): <div/>;
        const assignedReviewList = assignedReview.map((t: ITask) => (
            <div className="AssignedRow">
                <RevertAction
                    selected={true}
                    strings={strings}
                    target={unassignTask.bind(this, t.id, selectedUser)} />
                <TaskItem
                    id={t.id}
                    name={t.name}
                    length={t.length != null? t.length: 0}
                    selected={t.id === selectedTask}
                    select={selectTask.bind(this,selectedUser, t.id)}/>
                <div className={t.id === selectedTask? "selectBar": "placeHolder"}>{"\u00A0"}</div>
            </div>
        ));
        const assignedTranscribeList = assignedTranscribe.map((t: ITask) => (
            <div className="AssignedRow">
                <RevertAction
                    selected={true}
                    strings={strings}
                    target={unassignTask.bind(this, t.id, selectedUser)} />
                <TaskItem
                    id={t.id}
                    name={t.name}
                    length={t.length != null? t.length: 0}
                    selected={t.id === selectedTask}
                    select={selectTask.bind(this,selectedUser, t.id)}/>
                <div className={t.id === selectedTask? "selectBar": "placeHolder"}>{"\u00A0"}</div>
            </div>
        ));
        const availableHead = (availableReview.length + availableTranscribe.length > 0)?
            (<h3 className="SectionHead">{strings.available}</h3>): <div/>;
        const availableReviewHead = availableReview.length > 0?
            (<h4 className="ListHead">{strings.review.toUpperCase()}</h4>): <div/>;
        const availableTranscribeHead = availableTranscribe.length > 0?
            (<h4 className="ListHead">{strings.transcribe.toUpperCase()}</h4>): <div/>;
        const availableReviewList = availableReview.map((t: ITask) => (
            <div className="AvailableRow">
                <div className="placeHolder">{"\u00A0"}</div>
                <TaskItem
                    id={t.id}
                    name={t.name}
                    length={t.length != null? t.length: 0}
                    selected={t.id === selectedTask}
                    select={assignTask.bind(this,t.id, selectedUser)}/>
                <div className="placeHolder">{"\u00A0"}</div>
            </div>
        ));
        const availableTranscribeList = availableTranscribe.map((t: ITask) => (
            <div className="AvailableRow">
                <div className="placeHolder">{"\u00A0"}</div>
                <TaskItem
                    id={t.id}
                    name={t.name}
                    length={t.length != null? t.length: 0}
                    selected={t.id === selectedTask}
                    select={assignTask.bind(this,t.id, selectedUser)}/>
                <div className="placeHolder">{"\u00A0"}</div>
            </div>
        ));
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
            </div>
        ): <div/>;
        return (
            <div className="TaskPanel">
                {wrapper}
            </div>
        )
    }
};

interface IStateProps {
    assignedReview: ITask[];
    assignedTranscribe: ITask[];
    availableReview: ITask[];
    availableTranscribe: ITask[];
    lastTask: string | undefined;
    loaded: boolean;
    pending: boolean;
    selectedUser: string;
    selectedTask: string;
    strings: ITranscriberStrings;
}

const mapStateToProps = (state: IState): IStateProps => ({
    assignedReview: taskList(state).assignedReview,
    assignedTranscribe: taskList(state).assignedTranscribe,
    availableReview: taskList(state).availableReview,
    availableTranscribe: taskList(state).availableTranscribe,
    lastTask: userValue(state),
    loaded: state.tasks.loaded,
    pending: state.tasks.pending,
    selectedTask: state.tasks.selectedTask,
    selectedUser: state.users.selectedUser,
    strings: userStrings(state, {layout: "transcriber"}),
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
  
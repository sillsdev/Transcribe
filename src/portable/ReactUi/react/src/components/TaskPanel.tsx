import * as React from 'react';
import { connect } from 'react-redux';
import { assignTask, selectTask } from '../actions/taskActions';
import taskList from '../selectors';
import TaskItem from './controls/TaskItem';
import './TaskPanel.css';

interface IProps {
    assignTask: typeof assignTask;
    assignedTranscribe: ITask[];
    availableTranscribe: ITask[];
    loaded: boolean;
    pending: boolean;
    selectedUser: string;
    selectTask: typeof selectTask;
};

class TaskPanel extends React.Component<IProps, object> {
      public render() {
        const { assignedTranscribe, availableTranscribe, loaded, pending, selectedUser } = this.props;
        const transcribeHead = (assignedTranscribe.length + availableTranscribe.length > 0)?
            (<h3 className="SectionHead">TO TRANSCRIBE</h3>): <div/>;
        const assignedHead = assignedTranscribe.length > 0?
            (<h4 className="ListHead">Assigned</h4>): <div/>;
        const assignedList = assignedTranscribe.map((t: ITask) => (
            <TaskItem id={t.id} select={this.props.selectTask.bind(this,t.id)}/>
        ));
        const availableHead = availableTranscribe.length > 0?
            (<h4 className="ListHead">Available</h4>): <div/>;
        const availableList = availableTranscribe.map((t: ITask) => (
            <TaskItem id={t.id} select={this.props.assignTask.bind(this,t.id, selectedUser)}/>
        ));
        const wrapper: JSX.Element = !pending && loaded? (
            <div>
                {transcribeHead}
                {assignedHead}
                {assignedList}
                {availableHead}
                {availableList}
            </div>
        ): <div/>;
        return (
            <div className="TaskPanel">
                {wrapper}
            </div>
        )
    }
};

const mapStateToProps = (state: IState) => ({
    assignedTranscribe: taskList(state).assignedTranscribe,
    availableTranscribe: taskList(state).availableTranscribe,
    loaded: state.tasks.loaded,
    pending: state.tasks.pending,
    selectedUser: state.users.selectedUser,
  });
  
  export default connect(mapStateToProps, {assignTask, selectTask})(TaskPanel);
  
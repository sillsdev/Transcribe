import * as React from 'react';
import { connect } from 'react-redux';
import { assignTask, selectTask } from '../actions/taskActions';
import TaskItem from './controls/TaskItem';
import './TaskPanel.css';

interface ITask {
    assignedto: string;
    id: string;
    name: string;
    state: string;
};

interface IProject {
    id: string;
    type?: string;
    task: ITask[];
};

interface IProps {
    assignTask: (taskid:string, userid: string) => any;
    selectedProject: string;
    selectedUser: string;
    selectTask: (id:string) => any;
    projects: IProject[];
};

class TaskPanel extends React.Component<IProps, object> {
      public render() {
        const {projects, selectedProject, selectedUser} = this.props;
        const currentProject = projects.filter(p => p.id === selectedProject);
        const tasks = currentProject.length > 0? currentProject[0].task: [];
        const assignedTranscribe = tasks.filter(t => t.assignedto === selectedUser && t.state === "Transcribe");
        const availableTranscribe = tasks.filter(t => !(t.assignedto) && t.state === "Transcribe");
        const transcribeHead = (assignedTranscribe.length + availableTranscribe.length > 0)?
            (<h3 className="SectionHead">TO TRANSCRIBE</h3>): "";
        const assignedHead = assignedTranscribe.length > 0?
            (<h4 className="ListHead">Assigned</h4>):"";
        const assignedList = assignedTranscribe.map((t: ITask) => (
            <TaskItem id={t.id} select={this.props.selectTask.bind(t.id)}/>
        ));
        const availableHead = availableTranscribe.length > 0?
            (<h4 className="ListHead">Available</h4>):"";
        const availableList = availableTranscribe.map((t: ITask) => (
            <TaskItem id={t.id} select={this.props.assignTask.bind(t.id, selectedUser)}/>
        ));
        return (
            <div className="TaskPanel">
                {transcribeHead}
                {assignedHead}
                {assignedList}
                {availableHead}
                {availableList}
            </div>
            )
    }
};

const mapStateToProps = (state: any) => ({
    projects: state.tasks.projects,
    selectedProject: state.tasks.selectedProject,
    selectedUser: state.users.selectedUser,
  });
  
  export default connect(mapStateToProps, {assignTask, selectTask})(TaskPanel);
  
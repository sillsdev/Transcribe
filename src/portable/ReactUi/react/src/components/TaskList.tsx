import * as React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions2 from '../actions/localizationActions';
import * as actions from '../actions/taskActions';
import { IProjectSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize';
import allTasks from '../selectors/task';
import ButtonLink from './controls/ButtonLink'
import FilterAction from './controls/FilterAction';
import NextAction from './controls/NextAction'
import TaskItemPopup from './controls/TaskItemPopup';
import './TaskList.sass';
import LabelCaptionUx from './ui-controls/LabelCaptionUx'

interface IProps extends IStateProps, IDispatchProps {
};

class TaskList extends React.Component<IProps, object> {
    public componentDidMount() {
        const { fetchLocalization, fetchTasksOfProject, localizationLoaded, selectedParatextProject, selectedProject } = this.props;
        if (selectedParatextProject !== "" && selectedParatextProject !== selectedProject){
            fetchTasksOfProject(selectedParatextProject);
        }
        if (!localizationLoaded) {
            fetchLocalization();
        }
    }
    public render() {
        const { selectPopupTask, strings, tasks } = this.props

        // const selectTask = () => { alert("Task Details") }
        const taskList = tasks.map((t: ITask) =>
            <ListGroupItem key={t.id}>
                <TaskItemPopup
                    id={t.id}
                    name={t.name}
                    length={t.length != null? t.length: 0}
                    select= {selectPopupTask.bind(t.id)}/>
            </ListGroupItem>);

        const taskWrapper = (
            <ListGroup>
                {taskList}
            </ListGroup>);

        const sortByType = () => this.sortByType();

        const filterWrapper = tasks.length === 0? "": (
            <div className="SortFilterStyle">
                <FilterAction target={sortByType} text={strings.sortByType} />
            </div>);

        const ManyTask = () => { alert("Add Many Tasks") }
        const buttonWrapper = (
            <div className="Buttons">
                <NextAction text={strings.addMany} target={ManyTask} type="text-light" />
                <ButtonLink text={strings.addTask} target={"/ProjectSettings/NewTask"} type="outline-light" />
            </div>);

        return (
            <div className="TaskList">
                <div className="title">
                    <LabelCaptionUx name={strings.tasks} type="H3" />
                    {tasks.length === 0? buttonWrapper: filterWrapper}
                </div>
                {taskWrapper}
                {tasks.length === 0? "": buttonWrapper}
            </div>
        )
    }

    private sortByType(){
        alert("Sort By Type")
    }
}

interface IStateProps {
    loaded: boolean;
    localizationLoaded: boolean;
    users: IUser[];
    selectedParatextProject: string;
    selectedProject: string;
    selectedUser: string;
    strings: IProjectSettingsStrings;
    tasks: ITask[];
};

const mapStateToProps = (state: IState): IStateProps => ({
    loaded: state.users.loaded,
    localizationLoaded: state.strings.loaded,
    selectedParatextProject: state.paratextProjects.selectedParatextProject,
    selectedProject: state.tasks.selectedProject,
    selectedUser: state.users.selectedUser,
    strings: userStrings(state, {layout: "projectSettings"}),
    tasks: allTasks(state),
    users: state.users.users,
});

interface IDispatchProps {
    fetchLocalization: typeof actions2.fetchLocalization;
    fetchTasksOfProject: typeof actions.fetchTasks;
    selectPopupTask: typeof actions.selectPopupTask;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        fetchLocalization: actions2.fetchLocalization,
        fetchTasksOfProject: actions.fetchTasksOfProject,
        selectPopupTask: actions.selectPopupTask,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);

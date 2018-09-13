import * as React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/taskActions';
import { IProjectSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize'
import allTasks from '../selectors/task';
import ButtonLink from './controls/ButtonLink'
import LinkAction from './controls/LinkAction';
import TaskItem from './controls/TaskItem';
import './TasksList.sass';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';

interface IProps extends IStateProps, IDispatchProps {
};

class TasksList extends React.Component<IProps, object> {
    public componentDidMount() {
        const { fetchTasksOfProject } = this.props
        fetchTasksOfProject("TTP");
    }

    public render() {
        const { allTheTasks } = this.props
        const theTasks = allTheTasks.map((t: ITask) =>
            <ListGroupItem key={t.id}>
                <Link to={"/TaskDetails/" + t.id}>
                    <TaskItem
                        id={t.id}
                        name={t.name}
                        length={t.length != null ? t.length : 0}
                        selected={true} />
                </Link>
            </ListGroupItem>);

        const wrapper = (<ListGroup>
            {theTasks}
        </ListGroup>)

        const sortByTypeMethod = () => this.sortByType(this)

        const { strings } = this.props
        return (
            <div className="TasksList">
                <Grid>
                    <Row>
                        <Col xs={6} md={6}>
                            <LabelCaptionUx name={strings.tasks} type="H3" />
                        </Col>
                        <Col xs={6} md={6}>
                            <div className="SortFilterStyle">
                                <LinkAction target={sortByTypeMethod} text={strings.sortByType} />
                                <img src={require("./Images/Filter.svg")} alt="FIlter" />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={12}>
                            {wrapper}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={12}>
                            <div className="ButtonLink">
                                <span className="LinkAction">
                                    <LinkAction target={this.addManyClick} text={strings.addMany} />
                                </span>
                                <span>
                                    <ButtonLink text={strings.addTask} target="/TasksList" type="outline-light" />
                                </span>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }

    private addManyClick = () => {
        // tslint:disable-next-line:no-console
        console.log("ADD MANY button clicked!");
    }

    private sortByType(context: TasksList) {
        const { fetchTasksOfProject } = this.props
        fetchTasksOfProject("TTP");
    }
}

interface IStateProps {
    selectedProject: string;
    projects: IProject[];
    loaded: boolean;
    allTheTasks: ITask[];
    strings: IProjectSettingsStrings;
};

const mapStateToProps = (state: IState): IStateProps => ({
    allTheTasks: allTasks(state),
    loaded: state.tasks.loaded,
    projects: state.tasks.projects,
    selectedProject: state.tasks.selectedProject,
    strings:  userStrings(state, {layout: "projectSettings"}),
});

interface IDispatchProps {
    fetchTasksOfProject: typeof actions.fetchTasksOfProject;
    selectProject: typeof actions.selectProject;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        fetchTasksOfProject: actions.fetchTasksOfProject,
        selectProject: actions.selectProject,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TasksList);
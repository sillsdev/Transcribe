import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/taskActions';
import { IProjectSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize'
import currentProject from '../selectors/project';
import BackLink from './controls/BackLink';
import LinkAction from './controls/LinkAction';
import PencilAction from './controls/PencilAction';
import ToggleSwitch from './controls/ToggleSwitch';
import PeopleList from './PeopleList';
import './ProjectSettings.sass';
import TaskList from './TaskList';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';

interface IProps extends IStateProps, IDispatchProps {
    history: {
        location: {
            pathname: string;
        }
    }
};

class ProjectSettings extends React.Component<IProps, object> {
    public render() {
        const{ project, strings } = this.props
        const title = project != null && project.name != null? project.name: strings.projectName;
        const modal = this.props.history.location.pathname.length > 17? " Modal": ""
        return (
            <div id="ProjectSettings" className={"ProjectSettings" + modal}>
                <div className="rows">
                    <div className="properties">
                        <div className="header">
                            <BackLink target="/main" />
                            <LabelCaptionUx name={strings.projectSettings} type="H3" />
                        </div>
                        <div className="left">
                            <div className="title">
                                <LabelCaptionUx name={title} type="H1" />
                            </div>
                            <PencilAction target={this.editProjectName} />
                        </div>
                        <div className="paringRow">
                            <LinkAction text={strings.clickToPair} target={this.pair} />
                        </div>
                        <div className="switches">
                            <ToggleSwitch switched={false} text={strings.autoSyncParatext} type="switch1" />
                            <ToggleSwitch switched={false} text={strings.allowClaimUnassignedTasks} type="switch1" />
                        </div>
                    </div>
                    <div className="contents">
                        <PeopleList />
                        <TaskList />
                    </div>
                </div>
            </div >
        )
    }

    private editProjectName() {
        alert("Edit project name")
    }

    private pair() {
        alert("pair")
    }
}

interface IStateProps {
    project: IProject;
    selectedProject: string;
    selectedUser: string;
    projects: IProject[];
    loaded: boolean;
    strings: IProjectSettingsStrings;
};

const mapStateToProps = (state: IState): IStateProps => ({
    loaded: state.tasks.loaded,
    project: currentProject(state),
    projects: state.tasks.projects,
    selectedProject: state.tasks.selectedProject,
    selectedUser: state.users.selectedUser,
    strings:  userStrings(state, {layout: "projectSettings"}),
});

interface IDispatchProps {
    fetchTasks: typeof actions.fetchTasks;
    selectProject: typeof actions.selectProject;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        fetchTasks: actions.fetchTasks,
        selectProject: actions.selectProject,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSettings);
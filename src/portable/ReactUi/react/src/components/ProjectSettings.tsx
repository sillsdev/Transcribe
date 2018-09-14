import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/taskActions';
import { IProjectSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize'
import LinkAction from './controls/LinkAction';
import PencilAction from './controls/PencilAction';
import ToggleSwitch from './controls/ToggleSwitch';
import PeopleList from './PeopleList';
import './ProjectSettings.sass';
import TaskList from './TaskList';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';

interface IProps extends IStateProps, IDispatchProps {
};

class ProjectSettings extends React.Component<IProps, object> {
    public render() {
        const{strings} = this.props
        const paired = false;
        return (
            <div id="ProjectSettings" className="ProjectSettings">
                <div className="rows">
                    <div className="titles">
                        <div className="left">
                            <PencilAction target={this.editProjectName} />
                            <LabelCaptionUx name={strings.projectName} type="H1" />
                        </div>
                        <div className="right">
                            <div className="col">
                                <LabelCaptionUx name={strings.projectSettings} type="H2" />
                            </div>
                        </div>
                    </div>
                    <div className="paringRow">
                        <div className={(paired? "visible": "hidden")}>
                            <PencilAction target={this.pair} />
                        </div>
                        <LinkAction text={strings.clickToPair} target={this.pair} />
                    </div>
                    <div className="switches">
                        <ToggleSwitch switched={false} text={strings.autoSyncParatext} type="switch1" />
                        <ToggleSwitch switched={false} text={strings.allowClaimUnassignedTasks} type="switch1" />
                    </div>
                    <div className="lists">
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
    selectedUser: string;
    projects: IProject[];
    loaded: boolean;
    strings: IProjectSettingsStrings;
};

const mapStateToProps = (state: IState): IStateProps => ({
    loaded: state.tasks.loaded,
    projects: state.tasks.projects,
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
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../actions/taskActions';
import { IUserSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import uiDirection from '../selectors/direction';
import userStrings from '../selectors/localize';
import './AddManyTasks.sass';
import BackLink from './controls/BackLink';
import LinkAction from './controls/LinkAction';
import NextAction from './controls/NextAction';

interface IProps extends IStateProps, IDispatchProps {
};

class AddManyTasks extends React.Component<IProps, object> {

    public AddManyTasks = () => {
        const { addManyTasks, selectedUser, selectedProject } = this.props;
        addManyTasks(selectedUser, selectedProject);
    }

    public doFetch = () => {
        const {fetchTasksOfProject, selectedProject} = this.props;
        fetchTasksOfProject(selectedProject);
    }

    public render() {
        const { direction, strings } = this.props;
        return (
            <div className={"AddManyTasks " + (direction && direction === "rtl" ? "rtl" : "ltr")}>
                <div className="panel">
                    <div className="titleRow">
                        <BackLink action={this.doFetch} target="/ProjectSettings" />
                    </div>
                    <div className="browseDiv">
                        <NextAction text={strings.browse.toUpperCase()} target={this.AddManyTasks} type="primary" />
                    </div>
                    <div className="helpText">
                        <div className="firstLine">
                            Learn to create a
                    <span className="LinkAction">
                                <LinkAction text="batch upload spreadsheet" target={this.batchUploadSpreadsheetHelp} />
                            </span>
                            or to
                    </div>
                        <div className="secondLine">
                            rename your audio file with
                        <span className="LinkAction">
                                <LinkAction text="our naming convention." target={this.ourNamingConventionHelp} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }



    private batchUploadSpreadsheetHelp = () => {
        alert("Batch Upload Spreadsheet Help")
    }

    private ourNamingConventionHelp = () => {
        alert("Our Naming Convention Help")
    }

}
interface IStateProps {
    direction: string;
    selectedProject: string;
    selectedUser: string;
    strings: IUserSettingsStrings;
};

const mapStateToProps = (state: IState): IStateProps => ({
    direction: uiDirection(state),
    selectedProject: state.tasks.selectedProject,
    selectedUser: state.users.selectedUser,
    strings: userStrings(state, { layout: "userSettings" }),
});
interface IDispatchProps {
    addManyTasks: typeof actions.addManyTasks,
    fetchTasksOfProject: typeof actions.fetchTasksOfProject,
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        addManyTasks: actions.addManyTasks,
        fetchTasksOfProject: actions.fetchTasksOfProject,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddManyTasks);

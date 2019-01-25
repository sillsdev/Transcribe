import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/taskActions';
import { IUserSettingsStrings } from '../model/localize';
import { IProjectSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import uiDirection from '../selectors/direction';
import userStrings from '../selectors/localize';
import './AddManyTasks.sass';
import BackLink from './controls/BackLink';
import NextAction from './controls/NextAction';

interface IProps extends IStateProps, IDispatchProps {
};

export class AddManyTasks extends React.Component<IProps, object> {

    public AddManyTasks = () => {
        const { addManyTasks, selectedUser, selectedProject } = this.props;
        addManyTasks(selectedUser, selectedProject);
    }

    public doFetch = () => {
        const {fetchTasksOfProject, selectedProject} = this.props;
        fetchTasksOfProject(selectedProject);
    }

    public render() {
        const { direction, strings, strings2 } = this.props;
        const reactStringReplace = require('react-string-replace');

        const links = [ this.batchUploadSpreadsheetHelp, this.ourNamingConventionHelp ];
        const hotText = [ strings2.batchUpload, strings2.ourNamingConvention ];

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
                        <span>
                            {reactStringReplace(strings2.learnToAddMany, /\{(\d+)\}/g, (match: string) => (
                                <a key={"a" + match} className="linkText" onClick={links[match]}>{hotText[match]}</a>
                            ))}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    private batchUploadSpreadsheetHelp = () => {
        this.props.showHelp("Concepts/Spreadsheet_convention.htm")
    }

    private ourNamingConventionHelp = () => {
        this.props.showHelp("Concepts/Folder_and_Files.htm")
    }

}
interface IStateProps {
    direction: string;
    selectedProject: string;
    selectedUser: string;
    strings: IUserSettingsStrings;
    strings2: IProjectSettingsStrings;
};

const mapStateToProps = (state: IState): IStateProps => ({
    direction: uiDirection(state),
    selectedProject: state.tasks.selectedProject,
    selectedUser: state.users.selectedUser,
    strings: userStrings(state, { layout: "userSettings" }),
    strings2: userStrings(state, {layout: "projectSettings"}),
});
interface IDispatchProps {
    addManyTasks: typeof actions.addManyTasks,
    fetchTasksOfProject: typeof actions.fetchTasksOfProject,
    showHelp: typeof actions.showHelp,
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        addManyTasks: actions.addManyTasks,
        fetchTasksOfProject: actions.fetchTasksOfProject,
        showHelp: actions.showHelp,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddManyTasks);

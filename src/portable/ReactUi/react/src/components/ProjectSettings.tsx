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

const initialState = {
    showTextBox: false,
    titleText: "",
};

class ProjectSettings extends React.Component<IProps, typeof initialState> {
    public state = {...initialState}

    constructor(props: IProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public handleChange(event: any) {
        this.setState({ titleText: event.target.value });
    }

    public onClick = () => {
        this.setState({showTextBox : true});
    }

    public onBlur = () => {
        this.setState({showTextBox : false});
    }

    public componentWillMount()
     {
        const{ project, strings } = this.props;
        const title = project != null && project.name != null? project.name: strings.projectName;
        this.setState({titleText : title});
     }

    public render() {
        const{ strings } = this.props
        const modal = this.props.history.location.pathname.length > 17? " Modal": ""

        let titleWrapper;
        if(this.state.showTextBox){
            titleWrapper = (<input value={this.state.titleText} onBlur={this.onBlur} className="inputTitle" 
            onChange={this.handleChange} autoFocus={true} />);
        }
        else
        {
            titleWrapper = (<div className="title" onClick={this.onClick}>
            <LabelCaptionUx name={this.state.titleText} type="H1" /></div>);
        }
        return (
            <div id="ProjectSettings" className={"ProjectSettings" + modal}>
                <div className="rows">
                    <div className="properties">
                        <div className="header">
                            <BackLink target="/main" />
                            <LabelCaptionUx name={strings.projectSettings} type="H3" />
                        </div>
                        <div className="left">
                            {titleWrapper}
                            <PencilAction target={this.editProjectName} />
                        </div>
                        <div className="paringRow">
                            <LinkAction text={strings.clickToPair} target={this.pair} />
                        </div>
                        <div className="switches">
                            <ToggleSwitch switched={false} text={strings.allowClaimUnassignedTasks} type="switch1" />
                            <ToggleSwitch switched={false} text={strings.autoSyncParatext} type="switch1" />
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

    private editProjectName = () => {
        this.setState({showTextBox : true});
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
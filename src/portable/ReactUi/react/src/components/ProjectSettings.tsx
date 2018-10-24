import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { log } from '../actions/logAction';
import * as actions from '../actions/taskActions';
import { IProjectSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import uiDirection from '../selectors/direction';
import userStrings from '../selectors/localize';
import currentProject from '../selectors/project';
import BackLink from './controls/BackLink';
import LinkAction from './controls/LinkAction';
import PencilAction from './controls/PencilAction';
import ToggleSwitch from './controls/ToggleSwitch';
import './ProjectSettings.sass';
import TaskList from './TaskList';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';
import UserList from './UserList';

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
        this.onNameChange = this.onNameChange.bind(this);
        this.onNameKeyDown = this.onNameKeyDown.bind(this);
        this.onClaim = this.onClaim.bind(this);
        this.onSync = this.onSync.bind(this);
    }

    public onNameChange(event: any) {
        this.setState({ titleText: event.target.value });
    }

    public onNameKeyDown(event: any){
        if(event.keyCode === 13){
            this.setState({showTextBox : false});
            const{ project } = this.props;
            const projectName = (project.name !== undefined)?project.name:"";
            if(this.state.titleText.trim().toUpperCase() !== projectName.trim().toUpperCase()){
                this.props.updateProject({...project, name:this.state.titleText})
            }
        }
    }

    public onNameClick = () => {
        this.setState({showTextBox : true});
    }

    public onNameLooseFocus = () => {
        this.setState({showTextBox : false});
        const{ project } = this.props;
        const projectName = (project.name !== undefined)?project.name:"";
        if(this.state.titleText.trim().toUpperCase() !== projectName.trim().toUpperCase()){
            this.props.updateProject({...project, name:this.state.titleText})
        }
    }

    public componentWillReceiveProps(){
        const{ project, strings } = this.props;
        const title = project != null && project.name != null? project.name: strings.projectName;
        this.setState({titleText : title});
    }

    public render() {
        const{ direction, project, strings } = this.props

        log("ProjectSettings")
        let settingsStyle = this.props.history.location.pathname.length > 17? " Modal": ""
        settingsStyle = direction? settingsStyle + " " + direction: settingsStyle;

        let titleWrapper;
        if (this.state.showTextBox) {
            titleWrapper = (<input value={this.state.titleText} onBlur={this.onNameLooseFocus} className="inputTitle" 
            onChange={this.onNameChange} autoFocus={true} onKeyDown={this.onNameKeyDown} />);
        } else {
            titleWrapper = (<div className="title" onClick={this.onNameClick}>
            <LabelCaptionUx name={this.state.titleText} type="H1" /></div>);
        }

        const claim = project && project.claim? project.claim: false;
        const pair = project && project.guid && project.guid !== ""? true: false;
        const pairText = pair? strings.pairedWithParatextProject: strings.clickToPair;
        const sync = project && project.sync? project.sync: false;

        return (
            <div id="ProjectSettings" className={"ProjectSettings" + settingsStyle}>
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
                        <div className="pairingRow">
                            <LinkAction text={pairText} target={this.pair} />
                        </div>
                        <div className="switches">
                            <ToggleSwitch switched={claim} text={strings.allowClaimUnassignedTasks} onChange={this.onClaim}/>
                            <ToggleSwitch switched={pair} text={strings.pairWithParatext} onChange={this.pair} />
                            <ToggleSwitch switched={sync} text={strings.autoSyncParatext} enabled={pair} onChange={this.onSync} />
                        </div>
                    </div>
                    <div className="contents">
                        <UserList />
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

    private onClaim = (val: boolean) => {
        this.props.updateProject({...this.props.project, claim: val})
    }

    private onSync = (val: boolean) => {
       this.props.updateProject({...this.props.project, sync: val})
    }
}

interface IStateProps {
    direction: string;
    project: IProject;
    selectedProject: string;
    selectedUser: string;
    projects: IProject[];
    loaded: boolean;
    strings: IProjectSettingsStrings;
};

const mapStateToProps = (state: IState): IStateProps => ({
    direction: uiDirection(state),
    loaded: state.tasks.loaded,
    project: currentProject(state),
    projects: state.tasks.projects,
    selectedProject: state.tasks.selectedProject,
    selectedUser: state.users.selectedUser,
    strings:  userStrings(state, {layout: "projectSettings"}),
});

interface IDispatchProps {
    fetchTasks: typeof actions.fetchTasks;
    updateProject: typeof actions.updateProject;
    selectProject: typeof actions.selectProject;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        fetchTasks: actions.fetchTasks,
        selectProject: actions.selectProject,
        updateProject: actions.updateProject,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSettings);
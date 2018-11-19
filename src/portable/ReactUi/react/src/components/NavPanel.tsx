import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import { log } from '../actions/logAction';
import * as actions from '../actions/paratextProjectActions';
import * as actions2 from '../actions/taskActions';
import { ITranscriberStrings } from '../model/localize';
import { IState } from '../model/state';
import uiDirection from '../selectors/direction';
import userStrings from '../selectors/localize';
import Project from './controls/Project';
import User from './controls/User';
import './NavPanel.sass';
import IconButtonField from './ui-controls/IconButtonField';

interface IProps extends IStateProps, IDispatchProps{

};

const initialState = {
    backToHome: false,
    goTosearchParatextProjects: false,
    showProjectEdit: false,
}

class NavPanel extends React.Component<IProps, typeof initialState> {
    public state: typeof initialState;

    public constructor(props: IProps) {
        super(props);
        this.state = {...initialState}
        this.onLogOutClick = this.onLogOutClick.bind(this);
        this.onNewProject = this.onNewProject.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
    }

    public onToDoClick()
    {
        alert("TO DO Clicked!");
    }

    public onAllClick()
    {
        alert("All Clicked!");
    }

    public onTranscribedClick()
    {
        alert("Transcribed Clicked!");
    }

    public onReviewedClick()
    {
        alert("Reviewed Clicked!");
    }

    public onSyncedClick()
    {
        alert("Synced Clicked!");
    }

    public onLogOutClick() {
        this.setState({...this.state, backToHome: true})
    }

    public onNewProject() {
        const { clearSelectedParatextProject, fetchZttProjectsCount } = this.props;
        clearSelectedParatextProject();
        fetchZttProjectsCount();
        this.setState({...this.state, goTosearchParatextProjects: true});
    }

    public onChangeImage() {
        this.setState({...this.state, showProjectEdit: true})
    }

    public render() {
        const { direction, tasks, selectedProject, users, selectedUser, strings } = this.props;
        const { backToHome, goTosearchParatextProjects, showProjectEdit } = this.state;
        const user = users.filter(u => u.username.id === selectedUser)[0];
        const admin = user && user.role && user.role.filter(r => r === "administrator")[0];
        const project = tasks.filter(t => t.id === selectedProject)[0];
        let projectClick = "/main";
        let isAdminAsFirstUser = false;
        log("NavPanel")
        if (admin !== undefined && admin !== null) {
            projectClick = "/ProjectSettings";
            if(tasks.length === 1 && users.length === 1){
                isAdminAsFirstUser = true
            }
		}
        if (backToHome) {
            return ( <Redirect to="/" push={true} /> );
        }
        if(showProjectEdit){
            return ( <Redirect to="/avatar/Project" push={true} /> );
        }
        if(goTosearchParatextProjects) {
            return ( <Redirect to="/SearchParatextProjects" push={true} /> );
        }
        const userAvatar = user ? (
            <User id={user.username.id}
                name={user.displayName}
                target="/settings"
                uri={user.username.avatarUri? user.username.avatarUri: ""}
                role={user.role} />): "";
        const projectAvatar = project? (
            <Project id={project.id}
                name={project.id}
                target={projectClick}
                uri={project.uri !== undefined? project.uri:""}
                isAdmin = {(admin !== undefined && admin !== null)?true : false}
                newProject={this.onNewProject}
                changeImage={this.onChangeImage} />):"";

        return (
            <div id="NavPanel" className="NavPanel">
                {projectAvatar}
                <div className="TodoStyle">
                    <IconButtonField id="icon1" caption={strings.todo} imageUrl="TodoIcon.svg" bgColor="true" onClick={this.onToDoClick} reverse={direction !== undefined && direction === "rtl"} />
                </div>
{/*                 <div className="OptionsStyle">
                    <IconButtonField id="icon2" caption={strings.all} imageUrl="AllIcon.svg" onClick={this.onAllClick} />
                    <IconButtonField id="icon3" caption={strings.transcribed} imageUrl="TranscribedIcon.svg" onClick={this.onTranscribedClick} />
                    <IconButtonField id="icon4" caption={strings.reviewed} imageUrl="ReviewedIcon.svg" onClick={this.onReviewedClick} />
                    <IconButtonField id="icon5" caption={strings.synced} imageUrl="SyncedIcon.svg" onClick={this.onSyncedClick} />
                </div> */}
                <div className="LogoutStyle">
                    <IconButtonField id="icon6" caption={strings.logout} imageUrl="LogoutIcon.svg" reverse={direction !== undefined && direction === "rtl"} hidden={isAdminAsFirstUser} onClick={this.onLogOutClick} />
                </div>
                {userAvatar}
            </div>
        )
    }
};

interface IStateProps {
    direction: string;
    selectedProject: string;
    selectedUser: string;
    strings: ITranscriberStrings;
    tasks: IProject[];
    users: IUser[];
};

const mapStateToProps = (state: IState): IStateProps => ({
    direction: uiDirection(state),
    selectedProject: state.tasks.selectedProject,
    selectedUser: state.users.selectedUser,
    strings: userStrings(state, {layout: "transcriber"}),
    tasks: state.tasks.projects,
    users: state.users.users,
});

interface IDispatchProps {
    clearSelectedParatextProject: typeof actions.clearSelectedParatextProject;
    fetchZttProjectsCount: typeof actions2.fetchZttProjectsCount;
    selectParatextProject: typeof actions.selectParatextProject;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        clearSelectedParatextProject: actions.clearSelectedParatextProject,
        fetchZttProjectsCount: actions2.fetchZttProjectsCount,
        selectParatextProject: actions.selectParatextProject,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavPanel);

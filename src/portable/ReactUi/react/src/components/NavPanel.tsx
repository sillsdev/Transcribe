import * as React from 'react';
import { connect } from 'react-redux';
import { log } from '../actions/logAction';
import { ITranscriberStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize';
import Project from './controls/Project';
import User from './controls/User';
import './NavPanel.sass';
import IconButtonField from './ui-controls/IconButtonField';

interface IProps {
    selectedProject: string;
    selectedUser: string;
    strings: ITranscriberStrings;
    tasks: IProject[];
    users: IUser[];
};

class NavPanel extends React.Component<IProps, object> {

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

    public onLogOutClick()
    {
        alert("Log Out Clicked!");
    }

    public render() {
        const { tasks, selectedProject, users, selectedUser, strings } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];
        const admin = user && user.role && user.role.filter(r => r === "administrator")[0];
        const project = tasks.filter(t => t.id === selectedProject)[0];
        let projectClick = "/main";

        log("NavPanel")
        if (admin !== undefined && admin !== null) {
            projectClick = "/ProjectSettings";
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
                size="48"
                target={projectClick}
                uri={project.uri !== undefined? project.uri:""}
                isAdmin = {(admin !== undefined && admin !== null)?true : false} />):"";
        return (
            <div id="NavPanel" className="NavPanel">
                {projectAvatar}
                <div className="TodoStyle">
                    <IconButtonField id="icon1" caption={strings.todo} imageUrl="TodoIcon.svg" bgColor="true" onClick={this.onToDoClick} />
                </div>
                <div className="OptionsStyle">
                    <IconButtonField id="icon2" caption={strings.all} imageUrl="AllIcon.svg" onClick={this.onAllClick} />
                    <IconButtonField id="icon3" caption={strings.transcribed} imageUrl="TranscribedIcon.svg" onClick={this.onTranscribedClick} />
                    <IconButtonField id="icon4" caption={strings.reviewed} imageUrl="ReviewedIcon.svg" onClick={this.onReviewedClick} />
                    <IconButtonField id="icon5" caption={strings.synced} imageUrl="SyncedIcon.svg" onClick={this.onSyncedClick} />
                </div>
                <div className="LogoutStyle">
                    <IconButtonField id="icon6" caption={strings.logout} imageUrl="LogoutIcon.svg" onClick={this.onLogOutClick} />
                </div>
                {/* <div>{"\xA0"}</div> */}
                {userAvatar}
            </div>
        )
    }
};

const mapStateToProps = (state: IState): IProps => ({
    selectedProject: state.tasks.selectedProject,
    selectedUser: state.users.selectedUser,
    strings: userStrings(state, {layout: "transcriber"}),
    tasks: state.tasks.projects,
    users: state.users.users,
});

export default connect(mapStateToProps)(NavPanel);

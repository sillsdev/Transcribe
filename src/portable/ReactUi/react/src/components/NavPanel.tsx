import * as React from 'react';
import { connect } from 'react-redux';
import { log } from '../actions/logAction';
import { IState } from '../model/state';
import Project from './controls/Project';
import User from './controls/User';
import './NavPanel.sass';

interface IProps {
    selectedProject: string;
    selectedUser: string;
    tasks: IProject[];
    users: IUser[];
};

class NavPanel extends React.Component<IProps, object> {

    public render() {
        const { tasks, selectedProject, users, selectedUser} = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];
        const admin = user && user.role && user.role.filter(r => r === "administrator")[0];
        const project = tasks.filter(t => t.id === selectedProject)[0];
        let projectClick = "/main";

        log("NavPanel")
        if(admin !== undefined && admin !== null)
        {
            projectClick = "/ProjectSettings";
        }
        const userAvatar = user? (
            <User id={user.username.id}
                name={user.displayName}
                target="/settings"
                uri={user.username.avatarUri? user.username.avatarUri: ""}
                role={user.role} />):"";
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
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                {userAvatar}
            </div>
            )
    }
};

const mapStateToProps = (state: IState): IProps => ({
    selectedProject: state.tasks.selectedProject,
    selectedUser: state.users.selectedUser,
    tasks: state.tasks.projects,
    users: state.users.users,
});

export default connect(mapStateToProps)(NavPanel);

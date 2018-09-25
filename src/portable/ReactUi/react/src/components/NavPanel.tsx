import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from '../model/state';
import AvatarLink from './controls/AvatarLink';
import BackLink from './controls/BackLink';
import { ProjectAvatar } from './controls/ProjectAvatar';
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
        const project = tasks.filter(t => t.id === selectedProject)[0];
        const userAvatar = user? (
            <AvatarLink id={user.username.id}
                name={user.displayName}
                target="/settings"
                uri={user.username.avatarUri? user.username.avatarUri: ""} />):"";
        const projectAvatar = project? (
            <AvatarLink id={project.id}
                name={project.id}
                size="48"
                target="/main"
                uri={ProjectAvatar[project.type !== undefined?project.type:"Bible"]} />):"";
        return (
            <div id="NavPanel" className="NavPanel">
                <BackLink target="/" />
                {userAvatar}
                <div>{"\xA0"}</div>
                {projectAvatar}
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

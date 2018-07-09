import * as React from 'react';
import { connect } from 'react-redux';
import AvatarLink from './controls/AvatarLink';
import BackLink from './controls/BackLink';
import { ProjectAvatar } from './controls/ProjectAvatar';
import './NavPanel.css';


interface IProject {
    id: string;
    type?: string;
};

interface IUser {
    displayName: string,
    username: {
        avatarUri: string,
        id: string,
    }
};
  
interface IProps {
    selectedProject: string;
    selectedUser: string;
    tasks: IProject[];
    users: IUser[];
};

class NavPanel extends React.Component<IProps, object> {

    public render() {
        const { tasks, selectedProject, users, selectedUser} = this.props;
        const user:IUser = users.filter(u => u.username.id === selectedUser)[0];
        const project:IProject = tasks.filter(t => t.id === selectedProject)[0];
        return (
            <div className="NavPanel">
                <BackLink target="/" />
                <AvatarLink id={user.username.id}
                    name={user.displayName}
                    target="/"
                    uri={user.username.avatarUri} />
                <div>{"\xA0"}</div>
                <AvatarLink id={project.id}
                    name={project.id}
                    size="48"
                    target="/main"
                    uri={project.type !== undefined?ProjectAvatar[project.type]:""} />
            </div>
            )
    }
};

const mapStateToProps = (state: any): IProps => ({
    selectedProject: state.tasks.selectedProject,
    selectedUser: state.users.selectedUser,
    tasks: state.tasks.projects,
    users: state.users.users,
});

export default connect(mapStateToProps)(NavPanel);

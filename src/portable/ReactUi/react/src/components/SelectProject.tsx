import * as React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/taskActions';
import { ITranscriberStrings } from '../model/localize';
import { IState } from '../model/state';
import AvatarLink from './controls/AvatarLink';
import { ProjectAvatar } from './controls/ProjectAvatar';
import './SelectProject.sass';

interface IProps extends IStateProps, IDispatchProps {
};

class SelectProject extends React.Component<IProps, object> {
  public componentDidMount() {
    const { fetchTasks, selectedUser } = this.props

    fetchTasks(selectedUser);
  }

  public render() {
    const { loaded, projects, selectProject, selectedUser, strings, users } = this.props

    const user: IUser = users.filter((u: IUser) => u.username.id === selectedUser)[0];
    const admin = user.role.filter((s: string) => s.toLowerCase() === "administrator")[0];
    const dest = (admin != null)? "/ProjectSettings": "/main";

    const avatars = projects.map((p:IProject) => 
      <ListGroupItem key={p.id}>
        <AvatarLink id={p.id}
          name={strings[p.id.toLowerCase()]}
          target={dest}
          uri={p.type !== undefined? ProjectAvatar[p.type]: ""}
          select={selectProject} />
      </ListGroupItem>);

    let wrapper = (<ListGroup>
      {avatars}
    </ListGroup>)
    if (loaded){
      switch (projects.length){
        case 0:
          wrapper = (<Redirect to="/uilang"/>)
          break;
        case 1:
          selectProject(projects[0].id);
          wrapper = (<Redirect to={dest}/>)
        default:
          break;
      }
    }

    return (
      <div className="SelectProject">
        {wrapper}
      </div>
    );
  }
}

interface IStateProps {
  selectedUser: string;
  projects: IProject[];
  loaded: boolean;
  strings: ITranscriberStrings;
  users: IUser[];
};

const mapStateToProps = (state: IState): IStateProps => ({
  loaded: state.tasks.loaded,
  projects: state.tasks.projects,
  selectedUser: state.users.selectedUser,
  strings: state.strings.transcriber,
  users: state.users.users,
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectProject);

import * as React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { log } from '../actions/logAction';
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
    const { loaded, projects, selectProject, selectedUser, users } = this.props

    const dest = "/main";

    const user = users && users.filter(u =>  u.username.id === selectedUser)[0]
    const admin = user && user.role && user.role.filter(r => r === 'administrator')[0]

    log("SelectProject&loaded=" + loaded + "&admin=" + admin + "&nProjects=" + (projects? projects.length: 0) )

    if (loaded){
      if (admin && (projects? projects.length: 0) === 0) {
        return <Redirect to="/uilang"/>
      } else if (projects.length === 1) {
        return <Redirect to={dest}/>
      }
    }

    const avatars = projects.map((p:IProject) => 
      <ListGroupItem key={p.id}>
        <AvatarLink id={p.id}
          name={p.id}
          target={dest}
          uri={p.type !== undefined? ProjectAvatar[p.type]: ""}
          select={selectProject} />
      </ListGroupItem>);

    return (
      <div className="SelectProject">
        <ListGroup>
          {avatars}
        </ListGroup>
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

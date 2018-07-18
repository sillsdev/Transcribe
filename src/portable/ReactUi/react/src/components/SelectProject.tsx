import * as React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { fetchTasks, selectProject } from '../actions/taskActions';
import AvatarLink from './controls/AvatarLink';
import { ProjectAvatar } from './controls/ProjectAvatar';
import './SelectProject.css';

interface IProps {
  selectedUser: string;
  projects: IProject[];
  loaded: boolean;
  fetchTasks: typeof fetchTasks;
  selectProject: typeof selectProject;
};

class SelectProject extends React.Component<IProps, object> {
  public componentDidMount() {
    const { selectedUser } = this.props
    this.props.fetchTasks(selectedUser);
  }

  public render() {
    const { loaded, projects } = this.props

    const avatars = projects.map((p:IProject) => 
      <ListGroupItem key={p.id}>
        <AvatarLink id={p.id}
          name={p.id}
          target="/main"
          uri={p.type !== undefined?ProjectAvatar[p.type]:""}
          select={this.props.selectProject} />
      </ListGroupItem>);

    let wrapper = (<ListGroup>
      {avatars}
    </ListGroup>)
    if (loaded){
      switch (projects.length){
        case 0:
          wrapper = (<Redirect to="/"/>)
          break;
        case 1:
          this.props.selectProject(projects[0].id)
          wrapper = (<Redirect to="/main"/>)
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

const mapStateToProps = (state: IState) => ({
  loaded: state.tasks.loaded,
  projects: state.tasks.projects,
  selectedUser: state.users.selectedUser,
});

export default connect(mapStateToProps, { fetchTasks, selectProject })(SelectProject);

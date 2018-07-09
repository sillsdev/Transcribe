import * as React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { fetchTasks, selectTask } from '../actions/taskActions';
import AvatarLink from './controls/AvatarLink';
import './SelectProject.css';

interface IProject {
  id: string;
  type?: string;
};

interface IProps {
  selectedUser: string;
  projects: IProject[];
  fetchTasks: typeof fetchTasks;
  selectTask: typeof selectTask;
};

class SelectProject extends React.Component<IProps, object> {
  public componentDidMount() {
    const { selectedUser } = this.props
    this.props.fetchTasks(selectedUser);
  }

  public render() {
    const { projects } = this.props

    const projectAvatar = {
      Bible: "/assets/bibleAvatar.png",
      Story: "/assets/storyAvatar.png",
      Test: "/assets/testAvatar.png",
    }
    const avatars = projects.map((p:IProject) => 
      <ListGroupItem key={p.id}>
        <AvatarLink id={p.id} name={p.id} target="/main" uri={p.type !== undefined?projectAvatar[p.type]:""} select={this.props.selectTask} />
      </ListGroupItem>);

    let wrapper = (<ListGroup>
      {avatars}
    </ListGroup>)
    switch (projects.length){
      case 0:
        wrapper = (<Redirect to="/"/>)
        break;
      case 1:
        wrapper = (<Redirect to="/main"/>)
      default:
        break;
    }

    return (
      <div className="SelectProject">
        {wrapper}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  projects: state.tasks.projects,
  selectedUser: state.users.selectedUser,
});

export default connect(mapStateToProps, { fetchTasks, selectTask })(SelectProject);

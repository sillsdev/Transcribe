import * as React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchUsers, selectUser } from '../actions/userActions';
import AvatarLink from './controls/AvatarLink';
import './UserLogin.css';

interface IProps {
  users: IUser[];
  fetchUsers: typeof fetchUsers;
  selectUser: typeof selectUser;
};

class UserLogin extends React.Component<IProps, object> {
  public componentDidMount() {
    this.props.fetchUsers();
  }

  public render() {
    const { users } = this.props
    const avatars = users.map((user:IUser) => 
      <ListGroupItem key={user.id}>
        <AvatarLink id={user.username.id} name={user.displayName} target="/project" uri={user.username.avatarUri} select={this.props.selectUser} />
      </ListGroupItem>);

    return (
      <div className="UserLogin">
        <ListGroup>
            {avatars}
        </ListGroup>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  users: state.users.users
});

export default connect(mapStateToProps, { fetchUsers, selectUser })(UserLogin);

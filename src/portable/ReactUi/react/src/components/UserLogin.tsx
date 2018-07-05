import * as React from 'react';
import Avatar from 'react-avatar';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { fetchUsers, selectUser } from '../actions/userActions';
import './UserLogin.css';

interface IUser {
  id: number,
  displayName: string,
  username: {
    avatarUri: string,
  }
};

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
        <Link to="/main" onClick={this.props.selectUser.bind(this, user.id)}>
          <Avatar name={user.displayName} src={user.username.avatarUri} size="64" round={true}/>
          <br /> <br />
          <div className="caption">{user.displayName}</div>
        </Link>
      </ListGroupItem>);

    return (
      <div className="centered">
        <ListGroup>
            {avatars}
        </ListGroup>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  users: state.users.users
});

export default connect(mapStateToProps, { fetchUsers, selectUser })(UserLogin);

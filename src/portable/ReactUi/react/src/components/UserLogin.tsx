import * as React from 'react';
import Avatar from 'react-avatar';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchUsers, selectUser } from '../actions/userActions';
import './UserLogin.css';

class UserLogin extends React.Component<any> {
  public componentDidMount() {
    this.props.fetchUsers();
  }

  public render() {
    const { users } = this.props.users
    const avatars = users.map((user:any) => 
    <ListGroupItem key={user.id}>
      <div onClick={this.props.selectUser.bind(this, user.id)}>
        <Avatar name={user.displayName} src={user.username.avatarUri} size="64" round={true}/>
        <br /> <br />
        <div className="caption">{user.displayName}</div>
      </div>
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
  users: state.users
});

export default connect(mapStateToProps, { fetchUsers, selectUser })(UserLogin);

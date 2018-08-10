import * as React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions2 from '../actions/localizationActions';
import * as actions from '../actions/userActions';
import { IState } from '../model/state';
import AvatarLink from './controls/AvatarLink';
import './UserLogin.sass';

interface IProps extends IStateProps, IDispatchProps {
};

class UserLogin extends React.Component<IProps, object> {
  public componentDidMount() {
    const { fetchLocalization, fetchUsers } = this.props;

    fetchUsers();
    fetchLocalization();
  }

  public render() {
    const { selectUser, users } = this.props

    const avatars = users.map((user:IUser) => 
      <ListGroupItem key={user.id}>
        <AvatarLink
          id={user.username.id}
          name={user.displayName}
          target="/project"
          uri={user.username.avatarUri}
          select={selectUser} />
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

interface IStateProps {
  users: IUser[];
};

const mapStateToProps = (state: IState): IStateProps => ({
  users: state.users.users
});

interface IDispatchProps {
  fetchLocalization: typeof actions2.fetchLocalization;
  fetchUsers: typeof actions.fetchUsers;
  selectUser: typeof actions.selectUser;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
  ...bindActionCreators({
      fetchLocalization: actions2.fetchLocalization,
      fetchUsers: actions.fetchUsers,
      selectUser: actions.selectUser,
      }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserLogin);

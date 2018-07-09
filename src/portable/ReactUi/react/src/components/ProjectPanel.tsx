import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AvatarLink from './controls/AvatarLink';
import './ProjectPanel.css';

interface IUser {
    displayName: string,
    username: {
      avatarUri: string,
      id: string,
    }
  };
  
  interface IProps {
    selectedUser: string;
    users: IUser[];
};

class ProjectPanel extends React.Component<IProps, object> {

    public render() {
        const { users, selectedUser} = this.props;
        const user:IUser = users.filter(u => u.username.id === selectedUser)[0];
        return (
            <div className="ProjectPanel">
                <div className="BackLink">
                    <Link to="/">
                        <FontAwesome name="angle-left" />
                    </Link>
                </div>
                <AvatarLink id={user.username.id} name={user.displayName} target="/" uri={user.username.avatarUri} />
                <div>{"\xA0"}</div>
            </div>
            )
    }
};

const mapStateToProps = (state: any): IProps => ({
    selectedUser: state.users.selectedUser,
    users: state.users.users,
});

export default connect(mapStateToProps)(ProjectPanel);

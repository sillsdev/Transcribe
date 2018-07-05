import * as React from 'react';
import Avatar from 'react-avatar';
import { connect } from 'react-redux';

interface IProps {
    selectedUser: number;
    users: {
        users: Array<{
          id: number,
          displayName: string,
          username: {
            avatarUri: string,
          }
        }>
      };
};

class ProjectPanel extends React.Component<IProps, object> {
    public render() {
        const { users, selectedUser} = this.props;
        const user = users[selectedUser];
        const userAvatar = user !== undefined?
            (
                <div>
                <Avatar name={user.displayName} src={user.username.avatarUri} size="64" round={true}/>
                <br /> <br />
                <div className="caption">{user.displayName}</div>
            </div>
            ):"";
        return (
            <div>
                {userAvatar}
            </div>
            )
    }
};

const mapStateToProps = (state: any): IProps => ({
    selectedUser: state.users.selectedUser,
    users: state.users.users,
});

export default connect(mapStateToProps)(ProjectPanel);

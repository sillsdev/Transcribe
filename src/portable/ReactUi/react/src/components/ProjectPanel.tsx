import * as React from 'react';
import { connect } from 'react-redux';
import './ProjectPanel.css';

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
        // const { users, selectedUser} = this.props;
        // const user = users[selectedUser];

        return (
            <div className="ProjectPanel">.</div>
            )
    }
};

const mapStateToProps = (state: any): IProps => ({
    selectedUser: state.users.selectedUser,
    users: state.users.users,
});

export default connect(mapStateToProps)(ProjectPanel);

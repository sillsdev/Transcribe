import * as React from 'react';
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

class Editor extends React.Component<IProps, object> {
    public render() {
        return (
            <div className="Editor">.
            </div>
            )
    }
};

const mapStateToProps = (state: any): IProps => ({
    selectedUser: state.users.selectedUser,
    users: state.users.users,
});

export default connect(mapStateToProps)(Editor);

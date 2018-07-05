import * as React from 'react';
import Avatar from 'react-avatar';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
        const { users, selectedUser} = this.props;
        const user = users[selectedUser];
        const userAvatar = user !== undefined?
            (
            <tr className="myAvatar">
                <td className="myAvatar">
                    <Link to="/settings">
                        <Avatar name={user.displayName} src={user.username.avatarUri} size="64" round={true}/>
                        <br /> <br />
                        <div className="caption">{user.displayName}</div>
                    </Link>
                <div className="spacer">{"\xA0"}</div>
                </td>
            </tr>
            ):"";
        return (
            <table className="projectList">
                <tr className="backItem">
                    <td className="backItem">
                        <Link to="/" className="backItem">
                        <p className="backItem">{"<"}</p>
                        </Link>
                    </td>
                </tr>
                {userAvatar}
                <tr className="projectItem">
                <td className="projectItem">
                    <Link to="/main">
                    <Avatar name="Story Book" src={'./assets/storyAvatar.png'} size="48" round={true}/>
                    <br /> <br />
                    <div className="caption">Story Book</div>
                    </Link>
                </td>
                </tr>
                <tr className="projectItem">
                <td className="projectItem">
                    <Link to="/main">
                    <Avatar name="Bible" src={'./assets/bibleAvatar.png'} size="48" round={true}/>
                    <br /> <br />
                    <div className="caption">Bible</div>
                    </Link>
                </td>
                </tr>
                <tr className="projectItem">
                <td className="projectItem">
                    <Link to="/main">
                    <Avatar name="Test" src={'./assets/testAvatar.png'} size="48" round={true}/>
                    <br /> <br />
                    <div className="caption">Test</div>
                    </Link>
                </td>
                </tr>
            </table>
            )
    }
};

const mapStateToProps = (state: any): IProps => ({
    selectedUser: state.users.selectedUser,
    users: state.users.users,
});

export default connect(mapStateToProps)(ProjectPanel);

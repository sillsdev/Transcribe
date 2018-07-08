import * as React from 'react';
import { connect } from 'react-redux';
import { fetchTasks, selectTask } from '../actions/taskActions';
import './TaskPanel.css';

interface IUser {
    username: {
        id: string,
    }
};
  
  interface IProps {
    selectedUser: number;
    tasks: any[];
    users: IUser[];
    fetchTasks: typeof fetchTasks;
    selectTask: typeof selectTask;
  };
  
class TaskPanel extends React.Component<IProps, object> {
    public componentDidMount() {
        const { users, selectedUser} = this.props;
        const user = users[selectedUser];
        const username = user !== undefined? user.username.id: "";
        this.props.fetchTasks(username);
      }

      public render() {
        return (
            <div className="TaskPanel">.
            </div>
            )
    }
};

const mapStateToProps = (state: any) => ({
    selectedUser: state.users.selectedUser,
    tasks: state.tasks.tasks,
    users: state.users.users,
  });
  
  export default connect(mapStateToProps, { fetchTasks, selectTask })(TaskPanel);
  
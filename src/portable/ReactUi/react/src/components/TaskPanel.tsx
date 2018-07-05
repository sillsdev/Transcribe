import * as React from 'react';
import { Label, ListGroup, ListGroupItem, Panel } from 'react-bootstrap';
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
            <div className="TaskPanel">
                <ListGroup>
                    <ListGroupItem>
                        <Panel>
                            <h3><Label><p className="captionHeader"> TO REVIEW </p></Label></h3>
                            <p className="labelFileName"><Label>Assigned</Label></p>
                            <ListGroup>
                                <ListGroupItem>
                                    <div className="taskButton">File1</div>
                                </ListGroupItem><br/>
                            </ListGroup>
                            <p className="labelFileName"><Label>Available</Label></p>
                            <ListGroup>
                                <ListGroupItem>
                                    <div className="taskButton">File2</div>
                                </ListGroupItem><br/>
                                <ListGroupItem>
                                    <div className="taskButton">File3</div>
                                </ListGroupItem><br/>
                            </ListGroup>
                        </Panel>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Panel>
                            <h3><Label><p className="captionHeader"> TO TRANSCRIBE </p></Label></h3>
                            <p className="labelFileName"><Label>Assigned</Label></p>
                            <ListGroup>
                                <ListGroupItem>
                                    <div className="taskButton">File4</div>
                                </ListGroupItem><br/>
                            </ListGroup>
                            <p className="labelFileName"><Label>Available</Label></p>
                            <ListGroup>
                                <ListGroupItem>
                                    <div className="taskButton">File5</div>
                                </ListGroupItem><br/>
                                <ListGroupItem>
                                    <div className="taskButton">File6</div>
                                </ListGroupItem><br/>
                            </ListGroup>
                        </Panel>
                    </ListGroupItem>
                </ListGroup>
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
  
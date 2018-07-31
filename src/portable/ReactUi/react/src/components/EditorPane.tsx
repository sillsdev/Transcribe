import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from '../model/state';
import './EditorPane.css'

class EditorPane extends React.Component<IStateProps, any> {
    public render() {
        const { users, selectedProject, selectedUser } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];
        const project = user && user.project.filter(p => p.id === selectedProject)[0];
        const font = project != null? project.fontfamily: "SIL Charis"; // Tests null or undefined
        const size = project != null? project.fontsize: "12pt"; // Tests null or undefined

        return (
            <div className="EditorPane"> 
                <textarea style={{fontFamily: font, fontSize: size}} />
            </div>
        )
    }
};

interface IStateProps {
    selectedUser: string;
    selectedProject: string;
    users: IUser[];
};

const mapStateToProps = (state: IState): IStateProps => ({
    selectedProject: state.tasks.selectedProject,
    selectedUser: state.users.selectedUser,
    users: state.users.users,
});

export default connect(mapStateToProps)(EditorPane);

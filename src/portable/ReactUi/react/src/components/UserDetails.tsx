import * as React from 'react';
import Avatar from 'react-avatar';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import * as actions from '../actions/taskActions';
import * as actions2 from '../actions/userActions';
import { IProjectSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize'
import currentProject from '../selectors/project';
import AvatarLink from './controls/AvatarLink';
import NextAction from './controls/NextAction';
import PencilAction from './controls/PencilAction';
import { ProjectAvatar } from './controls/ProjectAvatar';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';
import LabelUx from './ui-controls/LabelUx';
import RadioListField from './ui-controls/RadioListField';
import TextField from './ui-controls/TextField';
import './UserDetails.sass';

interface IProps extends IStateProps, IDispatchProps {
    history: {
        location: {
            pathname: string;
        }
    }
};

const initialState = {
    avatarUrl: "",
    name: "",
    otherProjects: [],
    privileges: "",
    role: "Transcriber",
    selectedValue: "",
}

class UserDetails extends React.Component<IProps, typeof initialState> {
    public state = { ...initialState };
    private original: typeof initialState;
    private userId: string;

    constructor(props: IProps) {
        super(props)
        this.updateUserName = this.updateUserName.bind(this);
        this.updatePrivileges = this.updatePrivileges.bind(this);

        const { popupUser, users } = this.props;
        this.userId = this.props.history.location.pathname.indexOf("NewTask") > 0 ? "" : popupUser;
        if (this.userId && this.userId !== "") {
            const user: IUser = users.filter((u: IUser) => u.username.id === this.userId)[0];
            this.state.name = user.displayName
            if (user.username.avatarUri !== undefined) {
                this.state.avatarUrl = user.username.avatarUri
            }

            const roleCount = user.role.length
            if (roleCount === 3) {
                this.state.role = "Admin";
            }
            else if (roleCount === 2) {
                this.state.role = "Reviewer + Transcriber";
            }
            else if (roleCount === 1) {
                this.state.role = user.role[0];
            }
        } else {
            this.state = {...initialState}
        }
        this.original = { ...this.state };
    }

    public render() {

        const { deleted, strings, project, popupUser, users } = this.props;

        const save = () => this.save(this);
        const roleList = ["Admin", "Reviewer", "Transcriber", "Reviewer + Transcriber"];
        // const projectName = project != null && project.name != null ? project.name : strings.projectName;
        if (deleted) {
            return <Redirect to="/ProjectSettings" />
        }
        this.userId = this.props.history.location.pathname.indexOf("NewTask") > 0 ? "" : popupUser;
        const deleteUser = () => { this.delete(this) }
        const user: IUser = users.filter((u: IUser) => u.username.id === this.userId)[0];
        const projectAvatar = user && user.project ? (
            <AvatarLink id={project.id}
                name={project.id}
                size="48"
                target="/main"
                uri={ProjectAvatar[project.type !== undefined ? project.type : "Bible"]} />) : "";

        return (
            <div className="UserDetails">
                <div className="closeRow">
                    <Link onClick={save} to="/ProjectSettings" >
                        <img src="/assets/close-x.svg" alt="X" />
                    </Link>
                </div>
                <div className="titleRow">
                    <div className="title">
                        {/* <LabelCaptionUx name={strings.userDetails} type="H2" /> */}
                        <LabelCaptionUx name={strings.userDetails} type="H2" />
                    </div>
                    <div className={"deleteButton" + (this.userId !== "" ? "" : " hide")}>
                        <NextAction text={strings.delete} target={deleteUser} type="danger" />
                    </div>
                </div>
                <div className="details">
                    <div className="results">
                        <div className="resultsLeft">
                            <div className="AvatarColumn">
                                <div className="AvatarRow">
                                    <Avatar className="OnHover" name={this.state.name} src={this.state.avatarUrl} size={120} round={true} />
                                    <PencilAction target={this.editUserAvatar} />
                                    <br /> <br />
                                </div>
                                <div className="AvatarCaption">{this.state.name}</div>
                            </div>
                        </div>
                        <div className="resultsRight">
                            <div className="resultsRightBox">
                                <div><TextField id="id1" caption={"Name"} inputValue={this.state.name} onChange={this.updateUserName} /></div>
                                <div className="privilegesBox">
                                    <LabelUx name={strings.privileges} />
                                    <RadioListField options={roleList} selected={this.state.role} onChange={this.updatePrivileges} />
                                </div>
                                <div className="OtherProjectsBox">
                                    <LabelUx name={strings.otherProjects} />
                                    {projectAvatar}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    public handleChange(event: any) {
        this.setState({ selectedValue: event.target.value });
    }
    private editUserAvatar() {
        alert("Edit User Avatar");
    }

    private saveValue(updates: string[], tag: string, val: string | null) {
        updates.push(tag + '=' + encodeURIComponent(val != null ? val : ""))
    }

    private updateUserName(newName: string) {
        this.setState({ ...this.state, name: newName })
    }

    private updatePrivileges(newprivileges: string) {
        this.setState({ ...this.state, privileges: newprivileges })
    }

    private delete(ctx: UserDetails) {
        const { deleteUser } = this.props;
        deleteUser(this.userId);
    }

    private save(ctx: UserDetails) {
        const { selectedProject, updateUser } = this.props;

        const updates = Array<string>();

        if (this.state.name !== this.original.name) {
            this.saveValue(updates, "name", this.state.name);
        }

        if (this.state.privileges !== this.original.privileges) {
            this.saveValue(updates, "role", this.state.privileges);
        }

        if (updates.length > 0) {
            const query = '&' + updates.join('&');
            updateUser(this.userId, selectedProject, query);
        }
    }
}

interface IStateProps {
    deleted: boolean;
    project: IProject;
    popupUser: string;
    strings: IProjectSettingsStrings;
    users: IUser[];
    selectedParatextProject: string;
    selectedProject: string;
};

const mapStateToProps = (state: IState): IStateProps => ({
    deleted: state.users.deleted,
    popupUser: state.users.selectedPopupUser,
    project: currentProject(state),
    selectedParatextProject: state.paratextProjects.selectedParatextProject,
    selectedProject: state.tasks.selectedProject,
    strings: userStrings(state, { layout: "projectSettings" }),
    users: state.users.users,
});

interface IDispatchProps {
    fetchUsers: typeof actions2.fetchUsers;
    selectTask: typeof actions.selectTask;
    updateUser: typeof actions2.updateUser;
    deleteUser: typeof actions2.deleteUser;
};
const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        deleteUser: actions2.deleteUser,
        fetchUsers: actions2.fetchUsers,
        selectTask: actions.selectTask,
        updateUser: actions2.updateUser,
    }, dispatch),
});
export default connect(mapStateToProps,
    mapDispatchToProps
)(UserDetails);
import * as React from 'react';
import Avatar from 'react-avatar';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import { log } from '../actions/logAction';
import * as actions from '../actions/taskActions';
import * as actions2 from '../actions/userActions';
import store from "../globalsStore";
import { IProjectSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import uiDirection from '../selectors/direction';
import userStrings from '../selectors/localize';
import currentProject from '../selectors/project';
import AvatarLink from './controls/AvatarLink';
import BackLink from './controls/BackLink';
import IconButtonField from './ui-controls/IconButtonField';
import ImageField from './ui-controls/ImageField';
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
    discard: false,
    imageFile: "",
    img: {},
    name: "",
    otherProjects: [],
    role: "Transcriber",
    roles: "",
    selectedValue: "",
}

class UserDetails extends React.Component<IProps, typeof initialState> {
    public state = { ...initialState };
    private original: typeof initialState;
    private userId: string;
    private roleListDef: string[];
    private roleListLoc: string[];
    private imageRef: React.RefObject<ImageField>;

    constructor(props: IProps) {
        super(props)
        this.updateUserName = this.updateUserName.bind(this);
        this.updateImageFile = this.updateImageFile.bind(this);
        this.imageRef = React.createRef();
        this.updateRoles = this.updateRoles.bind(this);
        this.discard = this.discard.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        const { popupUser, users, strings } = this.props;
        this.roleListDef = ['Admin', 'Reviewer', 'Transcriber'];
        this.roleListLoc = [strings.admin, strings.reviewer, strings.transcriber];
        this.userId = this.props.history.location.pathname.indexOf("NewUser") > 0 ? "" : popupUser;
        
        if (this.userId && this.userId !== "") {
            const user: IUser = users.filter((u: IUser) => u.username.id === this.userId)[0];
            if(user !== undefined)
            {
                this.state.name = user.displayName
                if (user.username.avatarUri !== undefined && store.tempImageFile.length === 0) {
                    this.state.avatarUrl = user.username.avatarUri
                    this.state.imageFile = (user.username.avatarUri !== null)? user.username.avatarUri.replace("/api/images/", ""): "";
                }
                else
                {
                    this.state.avatarUrl = "/api/images/" + this.userId + ".png";
                    this.state.imageFile = this.userId + ".png";
                }
                const roleCount = user.role.length
                if (roleCount === 3) {
                    this.state.role = strings.admin;
                }
                else if (roleCount === 2) {
                    this.state.role = strings.reviewer + " + " + strings.transcriber;
                }
                else if (roleCount === 1) {
                    const userRole = this.roleListLoc[this.roleListDef.indexOf(user.role[0].charAt(0).toUpperCase() + user.role[0].slice(1))];
                    if (userRole === strings.transcriber) {
                        this.state.role = strings.transcriber;
                    }
                    else if (userRole === strings.reviewer) {
                        this.state.role = strings.reviewer;
                    }
                    else {
                        this.state.role = strings.transcriber;
                    }
                }
            }
            else {
                this.state = { ...initialState, role: this.roleListLoc[2] }
                this.state.name = this.userId;
                const imageName = this.userId; 
                this.state.avatarUrl = "/api/images/" + imageName + ".png";
                this.state.imageFile = this.userId + ".png";
            }
            
        } else {
            this.state = { ...initialState, role: this.roleListLoc[2] }
        }

        this.original = { ...this.state };
    }
    public render() {
        const { deleted, direction, strings, project, popupUser, users } = this.props;
        const { avatarUrl, discard, name } = this.state;
        const save = () => this.save(this);
        log("UserDetails")
        if (deleted || discard) {
            return (<Redirect to="/ProjectSettings" />)
        }
        const newUser = this.props.history.location.pathname.indexOf("NewUser") > 0;
        this.userId = this.props.history.location.pathname.indexOf("NewUser") > 0 ? "" : popupUser;
        const user: IUser = users.filter((u: IUser) => u.username.id === this.userId)[0];
        const projectAvatar = user && user.project ? (
            <AvatarLink id={project.id}
                name={project.id}
                size="48"
                target="/main"
                avatarShape={false}
                uri={project.uri !== undefined ? project.uri : ""} />) : "";
        return (
            <div className={"UserDetails " + (direction && direction === "rtl" ? "rtl" : "ltr")}>
                <div className="panel">
                    <div className="titleRow">
                        <BackLink action={save} target="/ProjectSettings" />
                        <div className="title">
                            <LabelCaptionUx name={strings.userDetails} type="H2" />
                        </div>
                    </div>
                    <div className="data">
                        <div><TextField id="id1" autofocus={true} caption={"Name"} inputValue={this.state.name} onChange={this.updateUserName} /></div>
                        <div><ImageField id="id2" caption={"Image File"} inputValue={this.state.imageFile} onChange={this.updateImageFile} ref={this.imageRef} /></div>
                    </div>
                    <div className="preview">
                        <LabelCaptionUx name={strings.preview} type="small" />
                        <div className={"AvatarRow" + (name !== "" ? "" : " hide")}>
                            <Avatar className="OnHover" name={name} key={avatarUrl} src={avatarUrl} size={64} round={true} />
                            <div className="AvatarDetails">
                                <div className="AvatarCaption">{name}</div>
                                <div><LabelUx name={this.state.role} /></div>
                            </div>
                        </div>
                    </div>
                    <div className="details">
                        <div className="results">
                            <div className="resultsRight">
                                <div className="resultsRightBox">

                                    <div className="rolesBox">
                                        <LabelUx name="Privilege Tier" />
                                        <RadioListField options={this.roleListLoc} selected={this.state.role} onChange={this.updateRoles} />
                                    </div>
                                    <div className="OtherProjectsBox">
                                        <LabelUx name={strings.otherProjects} />
                                        {projectAvatar}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="action">
                        <IconButtonField id="discard" caption={strings.discardChanges} imageUrl="CancelIcon.svg" onClick={this.discard} />
                        <IconButtonField id={"deleteUser" + (newUser ? "Hide" : "")} caption={strings.deleteUser} imageUrl="RejectIcon.svg" onClick={this.deleteUser} />
                    </div>
                </div>
            </div>
        )
    }

    public handleChange(event: any) {
        this.setState({ selectedValue: event.target.value });
    }

    private discard() {
        this.setState({ ...this.state, discard: true })
    }

    private saveValue(updates: string[], tag: string, val: string | null) {
        updates.push(tag + '=' + encodeURIComponent(val != null ? val : ""))
    }

    private updateUserName(newName: string) {
        const { selectPopupUser } = this.props;
        this.setState({ ...this.state, name: newName })
        selectPopupUser(newName);
    }

    private updateImageFile(newImage: string) {
        this.setState({ ...this.state, imageFile: newImage })
        if(newImage.length === 0) {
            this.setState({ ...this.state, avatarUrl: "" })
        }
    }

    private updateRoles(newroles: string) {
        this.setState({ roles: newroles, role: newroles })
    }

    private deleteUser() {
        const { deleteUser, popupUser } = this.props;
        deleteUser(popupUser);
    }

    private save(ctx: UserDetails) {
        const { selectedProject, updateUser } = this.props;

        const updates = Array<string>();
        store.tempImageFile = "";
        if (this.state.name !== this.original.name) {
            this.saveValue(updates, "name", this.state.name);
        }

        if (this.state.roles !== this.original.roles) {
            const userRole = this.roleListDef[this.roleListLoc.indexOf(this.state.roles)];
            this.saveValue(updates, "role", userRole);
        }

        if (this.state.avatarUrl !== this.original.avatarUrl || this.original.avatarUrl.length > 0) {
            this.saveValue(updates, "avatarUri", this.state.avatarUrl);
        }

        if (updates.length > 0) {
            const query = '&' + updates.join('&');
            // tslint:disable-next-line:no-console
            console.log("/api/updateUser?user=" + this.userId, '&project=' + selectedProject + query);
            updateUser(this.userId, selectedProject, query);
        }
    }
}

interface IStateProps {
    deleted: boolean;
    direction: string;
    project: IProject;
    popupUser: string;
    strings: IProjectSettingsStrings;
    users: IUser[];
    selectedParatextProject: string;
    selectedProject: string;
};

const mapStateToProps = (state: IState): IStateProps => ({
    deleted: state.users.deleted,
    direction: uiDirection(state),
    popupUser: state.users.selectedPopupUser,
    project: currentProject(state),
    selectedParatextProject: state.paratextProjects.selectedParatextProject,
    selectedProject: state.tasks.selectedProject,
    strings: userStrings(state, { layout: "projectSettings" }),
    users: state.users.users,
});

interface IDispatchProps {
    fetchUsers: typeof actions2.fetchUsers;
    selectPopupUser: typeof actions2.selectPopupUser,
    selectTask: typeof actions.selectTask;
    updateAvatar: typeof actions2.updateAvatar,
    updateUser: typeof actions2.updateUser;
    deleteUser: typeof actions2.deleteUser;
};
const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        deleteUser: actions2.deleteUser,
        fetchUsers: actions2.fetchUsers,
        selectPopupUser: actions2.selectPopupUser,
        selectTask: actions.selectTask,        
        updateAvatar: actions2.updateAvatar,
        updateUser: actions2.updateUser,
    }, dispatch),
});
export default connect(mapStateToProps,
    mapDispatchToProps
)(UserDetails);
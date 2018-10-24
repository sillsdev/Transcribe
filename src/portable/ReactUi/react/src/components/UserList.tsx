import * as React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions2 from '../actions/localizationActions';
import { log } from '../actions/logAction';
import * as actions from '../actions/userActions';
import { IProjectSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize'
import AvatarLink from './controls/AvatarLink';
import ButtonLink from './controls/ButtonLink';
import FilterAction from './controls/FilterAction';
import LabelCaptionUx from './ui-controls/LabelCaptionUx'
import './UserList.sass';

class UserList extends React.Component<any, object> {
    public componentDidMount() {
        const { fetchLocalization, fetchUsers, localizationLoaded, users } = this.props;
        if (users.length === 0) {
            fetchUsers();
        }
        if (!localizationLoaded) {
            fetchLocalization();
        }
    }
    public render() {
        const { selectedProject, selectPopupUser, selectedUser, users, strings } = this.props

        let otherUsers = [];
        let projectUsers;
        let userExists = false;

        log("UserList&selected=" + selectedUser + "&nOthers=" + otherUsers.length)
        if (selectedUser !== ""){
            otherUsers = users.filter((user: IUser) => user.username.id !== selectedUser);
        }

        if (otherUsers.length > 0)
        {
            // projectUsers = otherUsers.filter((user: IUser) => user.project !== undefined && user.project.filter((proj: IUserProjectSettings) => proj.id ===  selectedParatextProject)[0].id === selectedParatextProject);
            projectUsers = otherUsers.filter((user: IUser) => {
                const project = user.project && user.project.filter((p: IUserProjectSettings) => p.id === selectedProject)[0]
                return project != null
            })
            if (projectUsers.length > 0){
                userExists = true;
            }
        }

        let avatars;
        let userWrapper;

        if(userExists) {
            avatars = projectUsers.map((user: IUser) =>
                <ListGroupItem key={user.id}>
                    <AvatarLink
                        id={user.username.id}
                        name={user.displayName}
                        target="/ProjectSettings/User"
                        uri={user.username.avatarUri? user.username.avatarUri: ""}
                        select={selectPopupUser.bind(user.id)} />
                </ListGroupItem>);
            userWrapper = (
                <ListGroup>
                    {avatars}
                </ListGroup>);
        }
        else
        {
            userWrapper = "";
        }

        const sortByPrivilegesMethod = () => this.sortByPrivileges();

        const filterWrapper = (!userExists) ? "": (
            <div className="SortFilterStyle">
                <FilterAction target={sortByPrivilegesMethod} text={strings.sortByPrivileges} />
            </div>);

        const buttonWrapper = (
            <div className="Buttons">
                <ButtonLink
                    text={strings.addUser}
                    target="/ProjectSettings/User"
                    select={selectPopupUser.bind(this,"")}
                    type="outline-light" />
            </div>);

        return (
            <div className="UserList">
                <div className="title">
                    <LabelCaptionUx name={strings.people} type="H3" />
                    {(!userExists)? buttonWrapper: filterWrapper}
                </div>
                {userWrapper}
                {(!userExists)? "": buttonWrapper}
            </div>
        )
    }

    private sortByPrivileges() {
        alert("Filter by Priviledges")
    }
}

interface IStateProps {
    loaded: boolean;
    localizationLoaded: boolean;
    users: IUser[];
    selectedProject: string;
    selectedUser: string;
    strings: IProjectSettingsStrings;
    popupUser: string;
};

const mapStateToProps = (state: IState): IStateProps => ({
    loaded: state.users.loaded,
    localizationLoaded: state.strings.loaded,
    popupUser: state.users.selectedPopupUser,
    selectedProject: state.tasks.selectedProject,
    selectedUser: state.users.selectedUser,
    strings: userStrings(state, {layout: "projectSettings"}),
    users: state.users.users,
});

interface IDispatchProps {
    fetchLocalization: typeof actions2.fetchLocalization;
    fetchUsers: typeof actions.fetchUsers;
    selectPopupUser: typeof actions.selectPopupUser;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        fetchLocalization: actions2.fetchLocalization,
        fetchUsers: actions.fetchUsers,
        selectPopupUser: actions.selectPopupUser,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserList);

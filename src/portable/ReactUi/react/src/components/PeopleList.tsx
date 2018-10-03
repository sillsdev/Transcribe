import * as React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions2 from '../actions/localizationActions';
import * as actions from '../actions/userActions';
import { IProjectSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize'
import AvatarLink from './controls/AvatarLink';
import ButtonLink from './controls/ButtonLink';
import FilterAction from './controls/FilterAction';
import './PeopleList.sass';
import LabelCaptionUx from './ui-controls/LabelCaptionUx'

class PeopleList extends React.Component<any, object> {
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
        const { selectedUser, selectPopupUser, users, strings } = this.props

        const otherUsers = users.filter((user: IUser) => user.username.id !== selectedUser);

        const avatars = otherUsers.map((user: IUser) =>
            <ListGroupItem key={user.id}>
                <AvatarLink
                    id={user.username.id}
                    name={user.displayName}
                    target="/ProjectSettings/User"
                    uri={user.username.avatarUri? user.username.avatarUri: ""}
                    select={selectPopupUser.bind(user.id)} />
            </ListGroupItem>);

        const userWrapper = (
            <ListGroup>
                {avatars}
            </ListGroup>);

        const sortByPrivilegesMethod = () => this.sortByPrivileges();

        const filterWrapper = otherUsers.length === 0? "": (
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
            <div className="PeopleList">
                <div className="title">
                    <LabelCaptionUx name={strings.people} type="H3" />
                    {otherUsers.length === 0? buttonWrapper: filterWrapper}
                </div>
                {userWrapper}
                {otherUsers.length === 0? "": buttonWrapper}
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
    selectedUser: string;
    strings: IProjectSettingsStrings;
    popupUser: string;
};

const mapStateToProps = (state: IState): IStateProps => ({
    loaded: state.users.loaded,
    localizationLoaded: state.strings.loaded,
    popupUser: state.users.selectedPopupUser,
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

export default connect(mapStateToProps, mapDispatchToProps)(PeopleList);

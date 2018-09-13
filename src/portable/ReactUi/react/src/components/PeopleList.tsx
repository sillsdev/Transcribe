import * as React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Col, Grid, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions2 from '../actions/localizationActions';
import * as actions from '../actions/userActions';
import { IProjectSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize'
import AvatarLink from './controls/AvatarLink';
import ButtonLink from './controls/ButtonLink'
import LinkAction from './controls/LinkAction';
import './PeopleList.sass';
import LabelCaptionUx from './ui-controls/LabelCaptionUx'

class PeopleList extends React.Component<any, object> {
    public componentDidMount() {
        const { fetchLocalization, fetchUsers } = this.props;
        fetchUsers();
        fetchLocalization();
    }
    public render() {
        const { selectUser, users, strings } = this.props

        const avatars = users.map((user: IUser) =>
            <ListGroupItem key={user.id}>
                <AvatarLink
                    id={user.username.id}
                    name={user.displayName}
                    target="/project"
                    uri={user.username.avatarUri}
                    select={selectUser} />
            </ListGroupItem>);

        const wrapper = (<ListGroup>
            {avatars}
        </ListGroup>)
        const sortByPrivilegesMethod = () => this.sortByPrivileges(this)
        return (
            <div className="PeopleList">
                <Grid>
                    <Row className="name-row">
                        <Col xs={6} md={6}>
                            <LabelCaptionUx name={strings.people} type="H3" />
                        </Col>
                        <Col xs={6} md={6}>
                            <div className="SortFilterStyle">
                                <LinkAction target={sortByPrivilegesMethod} text={strings.sortByPrivileges} />
                                <img src={require("./Images/Filter.svg")} alt="FIlter" />
                            </div>
                        </Col>
                    </Row>
                    <Row className="name-row">
                        <Col xs={12} md={12}>
                            {wrapper}
                        </Col>
                    </Row>
                    <Row className="name-row">
                        <Col xs={12} md={12}>
                            <div className="ButtonLink">
                                <ButtonLink text={strings.addUser} target="/PeopleList" type="outline-light" />
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }

    private sortByPrivileges(context: PeopleList) {
        const { fetchUsers } = this.props
        fetchUsers();
    }
}

interface IStateProps {
    loaded: boolean;
    users: IUser[];
    strings: IProjectSettingsStrings;
};

const mapStateToProps = (state: IState): IStateProps => ({
    loaded: state.users.loaded,
    strings: userStrings(state, {layout: "projectSettings"}),
    users: state.users.users,
});

interface IDispatchProps {
    fetchLocalization: typeof actions2.fetchLocalization;
    fetchUsers: typeof actions.fetchUsers;
    selectUser: typeof actions.selectUser;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        fetchLocalization: actions2.fetchLocalization,
        fetchUsers: actions.fetchUsers,
        selectUser: actions.selectUser,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PeopleList);

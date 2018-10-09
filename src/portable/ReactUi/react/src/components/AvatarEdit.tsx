import * as React from 'react';
import Avatar from 'react-avatar-edit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/userActions';
import { IUserSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize';
import './AvatarEdit.sass';
import BackLink from './controls/BackLink';
import NextAction from './controls/NextAction';

const initialState = {
    preview: undefined,
}

interface IProps extends IStateProps, IDispatchProps {
    history: {
        location: {
            pathname: string;
        }
    }
}

class AvatarEdit extends React.Component<IProps, typeof initialState> {
    public state: typeof initialState;

    public constructor(props: IProps) {
        super(props);
        this.state = initialState
        this.onCrop = this.onCrop.bind(this)
        this.onSave = this.onSave.bind(this)
    }

    public render() {
        const { selectedUser, selectedPopUser, strings, users } = this.props;
        let user = users.filter(u => u.username.id === selectedUser)[0];
        let backTo = "/settings";
        if(this.props.history.location.pathname.includes("PopupUser"))
        {
            user = users.filter(u => u.username.id === selectedPopUser)[0];
            backTo = "/ProjectSettings/User";
        }
        return (
            <div className="AvatarEdit">
                <BackLink target={backTo} />

                <Avatar
                    width={390}
                    height={295}
                    label={strings.chooseAvatar}
                    onCrop={this.onCrop}
                    src={user !== undefined ? user.username.avatarUri : ""}
                />
                <div className="preview">
                    <img src={this.state.preview} alt="Preview" />
                    <NextAction target={this.onSave} text={strings.save} type="primary" />
                </div>
            </div>
        )
    }

    private onCrop(preview: any) {
        this.setState({ preview })
    }

    private onSave() {
        const { selectedUser, selectedPopUser, updateAvatar } = this.props;
        let currUser = selectedUser;
        if(this.props.history.location.pathname.includes("PopupUser")){
            currUser = selectedPopUser;
        }
        updateAvatar(currUser, this.state);
    }
};

interface IStateProps {
    selectedUser: string;
    selectedPopUser: string;
    strings: IUserSettingsStrings;
    users: IUser[];
};

const mapStateToProps = (state: IState): IStateProps => ({
    selectedPopUser: state.users.selectedPopupUser,
    selectedUser: state.users.selectedUser,
    strings: userStrings(state, { layout: "userSettings" }),
    users: state.users.users,
});

interface IDispatchProps {
    updateAvatar: typeof actions.updateAvatar,
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        updateAvatar: actions.updateAvatar,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AvatarEdit);

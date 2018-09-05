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
        const { selectedUser, strings, users } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];

        return (
            <div className="AvatarEdit">
                <BackLink target="/settings" />

                <Avatar
                    width={390}
                    height={295}
                    label={strings.chooseAvatar}
                    onCrop={this.onCrop} 
                    src={user !== undefined? user.username.avatarUri:""}
                    />
                <div className="preview">
                    <img src={this.state.preview} alt="Preview" />
                    <NextAction target={this.onSave} text={strings.save} type="primary" />
                </div>
            </div>
        )
    }

    private onCrop(preview: any) {
        this.setState({preview})
    }

    private onSave() {
        const { selectedUser, updateAvatar } = this.props;
        updateAvatar(selectedUser, this.state);
    }
};

interface IStateProps {
    selectedUser: string;
    strings: IUserSettingsStrings;
    users: IUser[];
};

const mapStateToProps = (state: IState): IStateProps => ({
    selectedUser: state.users.selectedUser,
    strings: userStrings(state, {layout: "userSettings"}),
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

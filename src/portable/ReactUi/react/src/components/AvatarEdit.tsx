import * as React from 'react';
import Avatar from 'react-avatar-edit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/userActions';
import { IUserSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize';
import './AvatarEdit.css';
import BackLink from './controls/BackLink';
import NextAction from './controls/NextAction';

const initialState = {
    preview: undefined,
    save: false,
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
                    onCrop={this.onCrop} 
                    src={user !== undefined? user.username.avatarUri:""}
                    />
                <div className="preview">
                    <img src={this.state.preview} alt="Preview" />
                    <NextAction target={this.onSave} text={strings.save} />
                </div>
            </div>
        )
    }

    private onCrop(preview: any) {
        this.setState({preview})
    }

    private onSave() {
        const { selectedUser, updateAvatar } = this.props;
        this.setState({save:true})
        // tslint:disable-next-line:no-console
        console.log("save avatar");
        updateAvatar(selectedUser, "&avatarBase64=" + this.state.preview)
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

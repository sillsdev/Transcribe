import * as React from 'react';
import Avatar from 'react-avatar-edit';
import { connect } from 'react-redux';
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
class AvatarEdit extends React.Component<IStateProps, typeof initialState> {
    public state: typeof initialState;

    public constructor(props: IStateProps) {
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
        this.setState({save:true})
        // tslint:disable-next-line:no-console
        console.log("save avatar");
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



export default connect(mapStateToProps)(AvatarEdit);

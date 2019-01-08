import * as React from 'react';
import Avatar from 'react-avatar';
import { Col, Grid, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as actions2 from 'src/actions/avatarActions';
import * as actions3 from 'src/actions/taskActions';
import { log } from '../actions/logAction';
import * as actions from '../actions/userActions';
import { IUserSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import { UserLanguages } from '../model/UserLanguages';
import userStrings from '../selectors/localize';
import BackLink from './controls/BackLink';
import LinkAction from './controls/LinkAction';
import NextAction from './controls/NextAction';
import AnchorHelp from './ui-controls/AnchorHelp';
import DropdownUx from './ui-controls/DropdownUx';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';
import LabelUx from './ui-controls/LabelUx';
import TextboxUx from './ui-controls/TextboxUx';
import './UserSettings.sass';

interface IProps extends IStateProps, IDispatchProps {
    history: {
        location: {
            pathname: string;
        }
    }
};

class UserSettings extends React.Component<IProps, any> {
    private nameRef: React.RefObject<TextboxUx>;
    private languageRef: React.RefObject<DropdownUx>;
    private fontRef: React.RefObject<TextboxUx>;
    private fontSizeRef: React.RefObject<DropdownUx>;
    private playPauseRef: React.RefObject<TextboxUx>;
    private backRef: React.RefObject<TextboxUx>;
    private forwardRef: React.RefObject<TextboxUx>;
    private slowerRef: React.RefObject<TextboxUx>;
    private fasterRef: React.RefObject<TextboxUx>;
    private fontSizeDef: string[];
    private fontSizeLoc: string[];
    // Default User HotKeys
    private defaultPlayPauseKey: string;
    private defaultBackKey: string;
    private defaultForwardKey: string;
    private defaultSlowerKey : string;
    private defaultFasterKey: string;

    constructor(props: IProps) {
        super(props)
        this.nameRef = React.createRef();
        this.languageRef = React.createRef();
        this.fontRef = React.createRef();
        this.fontSizeRef = React.createRef();
        this.playPauseRef = React.createRef();
        this.backRef = React.createRef();
        this.forwardRef = React.createRef();
        this.slowerRef = React.createRef();
        this.fasterRef = React.createRef();
        const { users, saveAvatar, selectedUser, setUserAvatar } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];
        const uri = (user && user.username && user.username.avatarUri)? user.username.avatarUri: ""
        saveAvatar({ data: uri, uri});
        setUserAvatar();
    }

    public componentWillMount()
    {
        const { restoreDefaultUserHotKeys } = this.props;
        // Fetch the Default User HotKeys
        restoreDefaultUserHotKeys();
    }

    public render() {
        const { avatar, users, selectedProject, selectedUser, strings } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];

        const project = user && user.project? user.project.filter(u => u.id === selectedProject)[0]: 
        {fontfamily: "SIL Charis", fontsize: "large", id:""};

        log("UserSettings")
        const settingsStyle = this.props.history.location.pathname.length > 17? " Modal": ""

        const playPauseKey = this.keyCode(user, "play-pause","");
        const backKey = this.keyCode(user, "back","");
        const forwardKey = this.keyCode(user, "forward","");
        const slowerKey = this.keyCode(user, "slower","");
        const fasterKey = this.keyCode(user, "faster","");

        const userLanguageCode = user && user.uilang? user.uilang.slice(0,2): "en";
        const languageChoice = [UserLanguages.languages.filter(i => i.slice(0,2) === userLanguageCode)[0].split(':')[1]].concat(
            UserLanguages.languages.filter(i => i.slice(0,2) !== userLanguageCode).map(i => i.split(':')[1])
        )

        this.fontSizeDef = ['medium', 'xx-small', 'x-small', 'small', 'large', 'x-large', 'xx-large'];
        this.fontSizeLoc = [strings.medium, 'xx-' + strings.small, 'x-' + strings.small, strings.small, strings.large, 'x-' + strings.large, 'xx-' + strings.large];
        const projFontSize = this.fontSizeLoc[this.fontSizeDef.indexOf((project && project.fontsize)? project.fontsize: "large")]
        const fontSizeChoice = [projFontSize].concat(this.fontSizeLoc.filter(v => v !== projFontSize));

        const saveMethod = () => this.save(this)
        const resetMethod = () => this.reset(this)

        return (
            <div id="UserSettings" className={"UserSettings" + settingsStyle}>
                <div className="GridStyle">
                    <Grid>
                        <Row className="show-grid AnchorStyle">
                            <Col xs={12} md={12}>
                                <AnchorHelp id="ProjSettingsHelp" onClick={this.ShowUserSettingsHelp} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>
                                <BackLink target="/main" />
                            </Col>
                            <Col xs={10} md={10}>
                                <LabelCaptionUx name={strings.user.toUpperCase()} type="H4" />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>&nbsp;</Col>
                            <Col xs={10} md={10}>
                                <Link className="pencil" to="/settings/avatar/User">{"\u2710"}</Link>
                                <Avatar
                                    id={user !== undefined? user.id: "NoUser"}
                                    name={user !== undefined ? user.displayName : ""}
                                    size="64"
                                    round={true}
                                    src={avatar} />

                            </Col>
                        </Row>
                        <br />
                        <Row className="name-row">
                            <Col xs={2} md={2}>
                                <LabelUx name={strings.name} />
                            </Col>
                            <Col xs={5} md={5}>
                                <TextboxUx id="DisplayName" ref={this.nameRef} isReadOnly={false}
                                    inputValue={user !== undefined ? user.displayName : ""}
                                    toolTipText=""/>
                            </Col>
                            <Col xs={1} md={1}>
                                <LabelUx name={strings.role} />
                            </Col>
                            <Col xs={4} md={4}>
                                <TextboxUx id="Role" isReadOnly={true}
                                    inputValue={user !== undefined? user.role.join(' + '): ""}
                                    toolTipText=""/>
                            </Col>
                        </Row>
                        <br />
                        <Row className="show-grid">
                            <Col xs={2} md={2}>&nbsp;</Col>
                            <Col xs={3} md={3}>
                                <LabelCaptionUx name={strings.language.toUpperCase()} />
                            </Col><Col xs={7} md={7}>
                                <DropdownUx id="Language" ref={this.languageRef} key="1" collection={languageChoice} />
                            </Col>
                        </Row>
                        <br />
                        <Row className="show-grid">
                            <Col xs={2} md={2}>&nbsp;</Col>
                            <Col xs={10} md={10}>
                                <LabelCaptionUx name={strings.transcriber.toUpperCase()} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>
                                <LabelUx name={strings.font} />
                            </Col>
                            <Col xs={3} md={3}>
                                <TextboxUx id="Font" ref={this.fontRef} isReadOnly={false} inputValue={(project && project.fontfamily)? project.fontfamily: "SIL Charis"}
                                    toolTipText="" />
                            </Col>
                            <Col xs={7} md={7}>
                                <DropdownUx id="FontSize" ref={this.fontSizeRef} key="1" collection={fontSizeChoice} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>&nbsp;</Col>
                            <Col xs={10} md={10}>
                                <LabelCaptionUx name={strings.keyboardShortcuts} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>
                                <LabelUx name={strings.playPause} />
                            </Col>
                            <Col xs={10} md={10}>
                                <TextboxUx id="PlayPauseKey" ref={this.playPauseRef} isReadOnly={false}  inputValue={playPauseKey} toolTipText="" />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>
                                <LabelUx name={strings.rewind} />
                            </Col>
                            <Col xs={10} md={10}>
                                <TextboxUx id="BackKey" ref={this.backRef} isReadOnly={false}  inputValue={backKey} toolTipText="" />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>
                                <LabelUx name={strings.fastForward} />
                            </Col>
                            <Col xs={10} md={10}>
                                <TextboxUx id="ForwardKey" ref={this.forwardRef} isReadOnly={false} inputValue={forwardKey} toolTipText="" />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>
                                <LabelUx name={strings.slowDown} />
                            </Col>
                            <Col xs={10} md={10}>
                                <TextboxUx
                                    id="SlowerKey"
                                    ref={this.slowerRef}
                                    isReadOnly={false}
                                    inputValue={slowerKey}
                                    toolTipText="" />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>
                                <LabelUx name={strings.speedUp} />
                            </Col>
                            <Col xs={10} md={10}>
                                <TextboxUx
                                    id="FasterKey"
                                    ref={this.fasterRef}
                                    isReadOnly={false}
                                    inputValue={fasterKey}
                                    toolTipText="" />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>&nbsp;</Col>
                            <Col xs={4} md={4}>
                                <LinkAction target={resetMethod} text={strings.reset.toUpperCase()}/>
                            </Col>
                            <Col xs={2} md={2} className="saveAction">
                                <NextAction target={saveMethod} text={strings.save} type="primary"/>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        )
    }

    private ShowUserSettingsHelp = () => {
        this.props.showHelp("Change user settings")
    }

    private keyCode(user: IUser, tag: string, defCode: string){
        if (user === undefined || user.hotkey === undefined) {
            return "";
        }
        const hotKey = user.hotkey.filter(h => h.id === tag)[0];
        return hotKey !== undefined? hotKey.text: defCode;
    }

    private saveValue(updates: string[], tag: string, val: string | null) {
        updates.push(tag + "=" + encodeURIComponent(val !== null? val: ""))
    }

    private save(context: UserSettings) {
        const { avatar, selectedProject, selectedUser, users, updateUser } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];
        const project = user && user.project? user.project.filter(u => u.id === selectedProject)[0]: 
        {fontfamily: "SIL Charis", fontsize: "large", id:""};

        const updates = Array<string>();
        let isValid = true;
        // Name
        const name = context.nameRef.current && context.nameRef.current.state.message;
        if (name !== null && name.length === 0) {
            if(context.nameRef.current !== null){
                context.nameRef.current.state.toolTipText = "Please fill in the Name.";
                this.setState({toolTipText: "Please fill in the Name."});
                isValid = false;
            }
        }
        else if (name !== null && name.length > 0) {
            if(context.nameRef.current !== null){
                context.nameRef.current.state.toolTipText = "";
                this.setState({toolTipText: ""});
                isValid = true;
            }
            if (user.displayName !== name) {
                this.saveValue(updates, "name", name)
            }
        }
        // Ui-Lang
        const language = context.languageRef.current && context.languageRef.current.selected;
        const languageCode = UserLanguages.languages.filter(l => l.split(':')[1] === language)[0].slice(0,2)
        if (user.uilang && user.uilang.slice(0,2) !== languageCode) {
            this.saveValue(updates, "uilang", languageCode)
        }
        // Font
        const font = context.fontRef.current && context.fontRef.current.state.message;
        if (font !== null && font.length === 0) {
            if(context.fontRef.current !== null){
                context.fontRef.current.state.toolTipText = "Please fill in the Font.";
                this.setState({toolTipText: "Please fill in the Font."});
                isValid = false;
            }
        }
        else if (font !== null && font.length > 0) {
            if(context.fontRef.current !== null){
                context.fontRef.current.state.toolTipText = "";
                this.setState({toolTipText: ""});
                isValid = true;
            }
            if (project.fontfamily !== font) {
                updates.push("font=" + font)
            }
        }
        const fontSize = context.fontSizeRef.current && context.fontSizeRef.current.selected;
        if (fontSize !== null) {
            const projFontSize = this.fontSizeDef[this.fontSizeLoc.indexOf(fontSize)]
            if (project.fontsize !== projFontSize) {
                this.saveValue(updates, "fontsize", projFontSize)
            }
        }
        // Play/Pause
        const playPause = context.playPauseRef.current && context.playPauseRef.current.state.message;
        if (playPause !== null && playPause.length === 0) {
            if(context.playPauseRef.current !== null){
                context.playPauseRef.current.state.toolTipText = "Please fill in the Play/Pause.";
                this.setState({toolTipText: "Please fill in the Play/Pause.."});
                isValid = false;
            }
        }
        else if (playPause !== null && playPause.length > 0) {
            if(context.playPauseRef.current !== null){
                context.playPauseRef.current.state.toolTipText = "";
                this.setState({toolTipText: ""});
                isValid = true;
            }
            if (user.hotkey && user.hotkey.filter(k => k.id === "play-pause")[0].text !== playPause) {
                this.saveValue(updates, "playpause", playPause)
            }
        }
        // Back
        const back = context.backRef.current && context.backRef.current.state.message;
        if (back !== null && back.length === 0) {
            if(context.backRef.current !== null){
                context.backRef.current.state.toolTipText = "Please fill in the Rewind.";
                this.setState({toolTipText: "Please fill in the Rewind."});
                isValid = false;
            }
        }
        else if (back !== null && back.length > 0) {
            if(context.backRef.current !== null){
                context.backRef.current.state.toolTipText = "";
                this.setState({toolTipText: ""});
                isValid = true;
            }
            if (user.hotkey && user.hotkey.filter(k => k.id === "back")[0].text !== back) {
                this.saveValue(updates, "back", back)
            }
        }
        // Forward
        const forward = context.forwardRef.current && context.forwardRef.current.state.message;
        if (forward !== null && forward.length === 0) {
            if(context.forwardRef.current !== null){
                context.forwardRef.current.state.toolTipText = "Please fill in the Fast Forward.";
                this.setState({toolTipText: "Please fill in the Fast Forward."});
                isValid = false;
            }
        }
        else if (forward !== null && forward.length > 0) {
            if(context.forwardRef.current !== null){
                context.forwardRef.current.state.toolTipText = "";
                this.setState({toolTipText: ""});
                isValid = true;
            }
            if (user.hotkey && user.hotkey.filter(k => k.id === "forward")[0].text !== forward) {
                this.saveValue(updates, "forward", forward)
            }
        }
        // Slower
        const slower = context.slowerRef.current && context.slowerRef.current.state.message;
        if (slower !== null && slower.length === 0) {
            if(context.slowerRef.current !== null){
                context.slowerRef.current.state.toolTipText = "Please fill in the Slow Down.";
                this.setState({toolTipText: "Please fill in the Slow Down."});
                isValid = false;
            }
        }
        else if (slower !== null && slower.length > 0) {
            if(context.slowerRef.current !== null){
                context.slowerRef.current.state.toolTipText = "";
                this.setState({toolTipText: ""});
                isValid = true;
            }
            if (user.hotkey && user.hotkey.filter(k => k.id === "slower")[0].text !== slower) {
                this.saveValue(updates, "slower", slower)
            }
        }
        // Faster
        const faster = context.fasterRef.current && context.fasterRef.current.state.message;
        if (faster !== null && faster.length === 0) {
            if(context.fasterRef.current !== null){
                context.fasterRef.current.state.toolTipText = "Please fill in the Speed Up.";
                this.setState({toolTipText: "Please fill in the Speed Up."});
                isValid = false;
            }
        }
        else if (faster !== null && faster.length > 0) {
            if(context.fasterRef.current !== null){
                context.fasterRef.current.state.toolTipText = "";
                this.setState({toolTipText: ""});
                isValid = true;
            }
            if (user.hotkey && user.hotkey.filter(k => k.id === "faster")[0].text !== faster) {
                this.saveValue(updates, "faster", faster)
            }
        }

        const img = ((user && user.username && user.username.avatarUri && user.username.avatarUri) !== avatar)?
            avatar: "";

        if (isValid === true && (updates.length > 0 || img !== "")) {
            const query = '&' + updates.join('&');
            // tslint:disable-next-line:no-console
            console.log("/api/UpdateUser?user=" + selectedUser, "&project=" + selectedProject + query);
            updateUser(selectedUser, selectedProject, query, {img})
        }
    }

    private reset(context: UserSettings) {
        const { users, selectedUser, userHotKeys } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];

        // Get the Default User HotKeys
        this.defaultPlayPauseKey = userHotKeys.filter(h => h.id === "play-pause")[0].text;
        this.defaultBackKey = userHotKeys.filter(h => h.id === "back")[0].text;
        this.defaultForwardKey = userHotKeys.filter(h => h.id === "forward")[0].text;
        this.defaultSlowerKey = userHotKeys.filter(h => h.id === "slower")[0].text;
        this.defaultFasterKey = userHotKeys.filter(h => h.id === "faster")[0].text;

        // Set the Default User HotKeys in the corresponding Textboxes
        if(context.playPauseRef.current !== null){
            context.playPauseRef.current.state.message = this.keyCode(user, "", this.defaultPlayPauseKey);
            this.setState({inputValue: this.keyCode(user, "", this.defaultPlayPauseKey)})
        }

        if(context.backRef.current !== null){
            context.backRef.current.state.message = this.keyCode(user, "", this.defaultBackKey);
            this.setState({inputValue: this.keyCode(user, "", this.defaultBackKey)})
        }

        if(context.forwardRef.current !== null){
            context.forwardRef.current.state.message = this.keyCode(user, "", this.defaultForwardKey);
            this.setState({inputValue: this.keyCode(user, "", this.defaultForwardKey)})
        }

        if(context.slowerRef.current !== null){
            context.slowerRef.current.state.message = this.keyCode(user, "", this.defaultSlowerKey);
            this.setState({inputValue: this.keyCode(user, "", this.defaultSlowerKey)})
        }

        if(context.fasterRef.current !== null){
            context.fasterRef.current.state.message = this.keyCode(user, "",this.defaultFasterKey);
            this.setState({inputValue: this.keyCode(user, "", this.defaultFasterKey)})
         }
     }
}

interface IStateProps {
    avatar: string;
    selectedUser: string;
    selectedProject: string;
    strings: IUserSettingsStrings;
    userHotKeys: IUserKeyVal[];
    users: IUser[];
};

const mapStateToProps = (state: IState): IStateProps => ({
    avatar: state.avatar.data,
    selectedProject: state.tasks.selectedProject,
    selectedUser: state.users.selectedUser,
    strings: userStrings(state, {layout: "userSettings"}),
    userHotKeys: state.users.userHotKeys,
    users: state.users.users,
});

interface IDispatchProps {
    fetchUsers: typeof actions.fetchUsers;
    restoreDefaultUserHotKeys: typeof actions.restoreDefaultUserHotKeys;
    saveAvatar: typeof actions2.saveAvatar;
    setUserAvatar: typeof actions2.setUserAvatar;
    showHelp: typeof actions3.showHelp,
    updateUser: typeof actions.updateUser;
  };
  
  const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        fetchUsers: actions.fetchUsers,
        restoreDefaultUserHotKeys: actions.restoreDefaultUserHotKeys,
        saveAvatar: actions2.saveAvatar,
        setUserAvatar: actions2.setUserAvatar,
        showHelp: actions3.showHelp,
        updateUser: actions.updateUser,
        }, dispatch),
  });

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);

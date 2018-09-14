import * as React from 'react';
import Avatar from 'react-avatar';
import { Col, Grid, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/userActions';
import { IUserSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import { UserLanguages } from '../model/UserLanguages';
import userStrings from '../selectors/localize';
import BackLink from './controls/BackLink';
import LinkAction from './controls/LinkAction';
import NextAction from './controls/NextAction';
import DropdownUx from './ui-controls/DropdownUx';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';
import LabelUx from './ui-controls/LabelUx';
import TextboxUx from './ui-controls/TextboxUx';
import './UserSettings.sass';

interface IProps extends IStateProps, IDispatchProps {
}

class UserSettings extends React.Component<IProps, any> {
    private nameRef: React.RefObject<TextboxUx>;
    private languageRef: React.RefObject<DropdownUx>;
    private fontRef: React.RefObject<TextboxUx>;
    private fontSizeRef: React.RefObject<DropdownUx>;
    private playpauseRef: React.RefObject<TextboxUx>;
    private backRef: React.RefObject<TextboxUx>;
    private aheadRef: React.RefObject<TextboxUx>;
    private slowRef: React.RefObject<TextboxUx>;
    private fastRef: React.RefObject<TextboxUx>;
    private fontSizeDef: string[];
    private fontSizeLoc: string[];

    constructor(props: IProps) {
        super(props)
        this.nameRef = React.createRef();
        this.languageRef = React.createRef();
        this.fontRef = React.createRef();
        this.fontSizeRef = React.createRef();
        this.playpauseRef = React.createRef();
        this.backRef = React.createRef();
        this.aheadRef = React.createRef();
        this.slowRef = React.createRef();
        this.fastRef = React.createRef();
    }

    public render() {
        const { users, selectedProject, selectedUser, strings } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];

        const project = user !== undefined? user.project.filter(u => u.id === selectedProject)[0]: 
        {fontfamily: "SIL Charis", fontsize: "medium", id:""};

        const playPauseKey = this.keyCode(user, "play-pause", "ESC");
        const backKey = this.keyCode(user, "back", "F1");
        const forwardKey = this.keyCode(user, "forward", "F2");
        const slowerKey = this.keyCode(user, "slower", "F3");
        const fasterKey = this.keyCode(user, "faster", "F4");

        const userLanguageCode = user !== undefined? user.uilang.slice(0,2): "en";
        const languageChoice = [UserLanguages.languages.filter(i => i.slice(0,2) === userLanguageCode)[0].slice(3)].concat(
            UserLanguages.languages.filter(i => i.slice(0,2) !== userLanguageCode).map(i => i.slice(3))
        )

        this.fontSizeDef = ['medium', 'xx-small', 'x-small', 'small', 'large', 'x-large', 'xx-large'];
        this.fontSizeLoc = [strings.medium, 'xx-' + strings.small, 'x-' + strings.small, strings.small, strings.large, 'x-' + strings.large, 'xx-' + strings.large];
        const projFontSize = this.fontSizeLoc[this.fontSizeDef.indexOf(project.fontsize)]
        const fontSizeChoice = [projFontSize].concat(this.fontSizeLoc.filter(v => v !== projFontSize));

        const saveMethod = () => this.save(this)
        const resetMethod = () => this.reset(this)

        return (
            <div id="UserSettings" className="UserSettings">
                <div className="GridStyle">
                    <Grid>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>
                                <BackLink target="/main" />
                            </Col>
                            <Col xs={10} md={10}>
                                <LabelCaptionUx name={strings.user.toUpperCase()} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>&nbsp;</Col>
                            <Col xs={10} md={10}>
                                <Link className="pencil" to="/avatar">{"\u2710"}</Link>
                                <Avatar
                                    id={user.id}
                                    size="64"
                                    round={true}
                                    src={user !== undefined? user.username.avatarUri:""} />

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
                                <TextboxUx id="Font" ref={this.fontRef} isReadOnly={false} inputValue={project.fontfamily}
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
                                <TextboxUx id="PlayPause" ref={this.playpauseRef} isReadOnly={false}  inputValue={playPauseKey} toolTipText="" />
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
                                <TextboxUx id="AheadKey" ref={this.aheadRef} isReadOnly={false} inputValue={forwardKey} toolTipText="" />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>
                                <LabelUx name={strings.slowDown} />
                            </Col>
                            <Col xs={10} md={10}>
                                <TextboxUx
                                    id="SlowKey"
                                    ref={this.slowRef}
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
                                    id="FastKey"
                                    ref={this.fastRef}
                                    isReadOnly={false}
                                    inputValue={fasterKey}
                                    toolTipText="" />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>&nbsp;</Col>
                            <Col xs={10} md={10}>
                                <LinkAction target={resetMethod} text={strings.reset.toUpperCase()}/>
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={10} md={10}>&nbsp;</Col>
                            <Col xs={2} md={2} className="saveAction">
                                <NextAction target={saveMethod} text={strings.save} type="primary"/>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        )
    }

    private keyCode(user: IUser, tag: string, defCode: string){
        if (user === undefined) {
            return "";
        }
        const hotKey = user.hotkey.filter(h => h.id === tag)[0];
        return hotKey !== undefined? hotKey.text: defCode;
    }

    private saveValue(updates: string[], tag: string, val: string | null) {
        updates.push(tag + "=" + encodeURIComponent(val !== null? val: ""))
    }

    private save(context: UserSettings) {
        const { selectedProject, selectedUser, users, updateUser } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];
        const project = user !== undefined? user.project.filter(u => u.id === selectedProject)[0]: 
        {fontfamily: "SIL Charis", fontsize: "medium", id:""};

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
        const languageCode = UserLanguages.languages.filter(l => l.slice(3) === language)[0].slice(0,2)
        if (user.uilang.slice(0,2) !== languageCode) {
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
        const playpause = context.playpauseRef.current && context.playpauseRef.current.state.message;
        if (playpause !== null && playpause.length === 0) {
            if(context.playpauseRef.current !== null){
                context.playpauseRef.current.state.toolTipText = "Please fill in the Play/Pause.";
                this.setState({toolTipText: "Please fill in the Play/Pause.."});
                isValid = false;
            }
        }
        else if (playpause !== null && playpause.length > 0) {
            if(context.playpauseRef.current !== null){
                context.playpauseRef.current.state.toolTipText = "";
                this.setState({toolTipText: ""});
                isValid = true;
            }
            if (user.hotkey.filter(k => k.id === "play-pause")[0].text !== playpause) {
                this.saveValue(updates, "playpause", playpause)
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
            if (user.hotkey.filter(k => k.id === "back")[0].text !== back) {
                this.saveValue(updates, "back", back)
            }
        }
        // Forward
        const forward = context.aheadRef.current && context.aheadRef.current.state.message;
        if (forward !== null && forward.length === 0) {
            if(context.aheadRef.current !== null){
                context.aheadRef.current.state.toolTipText = "Please fill in the Fast Forward.";
                this.setState({toolTipText: "Please fill in the Fast Forward."});
                isValid = false;
            }
        }
        else if (forward !== null && forward.length > 0) {
            if(context.aheadRef.current !== null){
                context.aheadRef.current.state.toolTipText = "";
                this.setState({toolTipText: ""});
                isValid = true;
            }
            if (user.hotkey.filter(k => k.id === "forward")[0].text !== forward) {
                this.saveValue(updates, "forward", forward)
            }
        }
        // Slower
        const slower = context.slowRef.current && context.slowRef.current.state.message;
        if (slower !== null && slower.length === 0) {
            if(context.slowRef.current !== null){
                context.slowRef.current.state.toolTipText = "Please fill in the Slow Down.";
                this.setState({toolTipText: "Please fill in the Slow Down."});
                isValid = false;
            }
        }
        else if (slower !== null && slower.length > 0) {
            if(context.slowRef.current !== null){
                context.slowRef.current.state.toolTipText = "";
                this.setState({toolTipText: ""});
                isValid = true;
            }
            if (user.hotkey.filter(k => k.id === "slower")[0].text !== slower) {
                this.saveValue(updates, "slower", slower)
            }
        }
        // Faster
        const faster = context.fastRef.current && context.fastRef.current.state.message;
        if (faster !== null && faster.length === 0) {
            if(context.fastRef.current !== null){
                context.fastRef.current.state.toolTipText = "Please fill in the Speed Up.";
                this.setState({toolTipText: "Please fill in the Speed Up."});
                isValid = false;
            }
        }
        else if (faster !== null && faster.length > 0) {
            if(context.fastRef.current !== null){
                context.fastRef.current.state.toolTipText = "";
                this.setState({toolTipText: ""});
                isValid = true;
            }
            if (user.hotkey.filter(k => k.id === "faster")[0].text !== faster) {
                this.saveValue(updates, "faster", faster)
            }
        }

        if (isValid === true && updates.length > 0) {
            const query = '&' + updates.join('&');
            // tslint:disable-next-line:no-console
            console.log("/api/UpdateUser?user=" + selectedUser, "&project=" + selectedProject + query);
            updateUser(selectedUser, selectedProject, query)
        }
    }

    private reset(context: UserSettings) {
       const { users, selectedUser } = this.props;
       const user = users.filter(u => u.username.id === selectedUser)[0];

       const defaultPlayPauseCode = 'Esc';
       const defaultRewindCode = 'F1';
       const defaultFastForwardCode = 'F2';
       const defaultSlowDownCode = 'F3';
       const defaultSpeedUpCode = 'F4';

       if(context.playpauseRef.current !== null){
           context.playpauseRef.current.state.message = this.keyCode(user, 'playpauseRef', defaultPlayPauseCode);
           this.setState({inputValue: this.keyCode(user, 'playpauseRef', defaultPlayPauseCode)})
       }

       if(context.backRef.current !== null){
           context.backRef.current.state.message = this.keyCode(user, 'backRef', defaultRewindCode);
           this.setState({inputValue: this.keyCode(user, 'backRef', defaultRewindCode)})
       }

       if(context.aheadRef.current !== null){
           context.aheadRef.current.state.message = this.keyCode(user, 'aheadRef', defaultFastForwardCode);
           this.setState({inputValue: this.keyCode(user, 'aheadRef', defaultFastForwardCode)})
       }

       if(context.slowRef.current !== null){
           context.slowRef.current.state.message = this.keyCode(user, 'slowRef', defaultSlowDownCode);
           this.setState({inputValue: this.keyCode(user, 'slowRef', defaultSlowDownCode)})
       }

       if(context.fastRef.current !== null){
           context.fastRef.current.state.message = this.keyCode(user, 'fastRef', defaultSpeedUpCode);
           this.setState({inputValue: this.keyCode(user, 'fastRef', defaultSpeedUpCode)})
        }
    }
}

interface IStateProps {
    selectedUser: string;
    selectedProject: string;
    strings: IUserSettingsStrings;
    users: IUser[];
};

const mapStateToProps = (state: IState): IStateProps => ({
    selectedProject: state.tasks.selectedProject,
    selectedUser: state.users.selectedUser,
    strings: userStrings(state, {layout: "userSettings"}),
    users: state.users.users,
});

interface IDispatchProps {
    fetchUsers: typeof actions.fetchUsers;
    updateUser: typeof actions.updateUser;
  };
  
  const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        fetchUsers: actions.fetchUsers,
        updateUser: actions.updateUser,
        }, dispatch),
  });

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);

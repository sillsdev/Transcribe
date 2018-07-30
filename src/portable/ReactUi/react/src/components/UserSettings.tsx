import * as React from 'react';
import Avatar from 'react-avatar';
import { Col, Grid, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/userActions';
import { IUserSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize';
import BackLink from './controls/BackLink';
import LinkAction from './controls/LinkAction';
import NextAction from './controls/NextAction';
import DropdownUx from './ui-controls/DropdownUx';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';
import LabelUx from './ui-controls/LabelUx';
import TextboxUx from './ui-controls/TextboxUx';
import './UserSettings.css';

interface IProps extends IStateProps, IDispatchProps {
}

class UserSettings extends React.Component<IProps, any> {
    private languages: string[];
    private avatarRef: React.RefObject<typeof Avatar>;
    private nameRef: React.RefObject<TextboxUx>;
    private languageRef: React.RefObject<DropdownUx>;
    private fontRef: React.RefObject<TextboxUx>;
    private fontSizeRef: React.RefObject<DropdownUx>;
    private playpauseRef: React.RefObject<TextboxUx>;
    private backRef: React.RefObject<TextboxUx>;
    private aheadRef: React.RefObject<TextboxUx>;
    private slowRef: React.RefObject<TextboxUx>;
    private fastRef: React.RefObject<TextboxUx>;

    constructor(props: IProps) {
        super(props)
        this.languages =  [ 'en:English', 'ar:عربى', 'fr:Français', 'ha:Hausa', 'pt:Português', 'ru:Pусский', 'ta:தமிழ்' ];
        this.avatarRef = React.createRef();
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
        const languageChoice = [this.languages.filter(i => i.slice(0,2) === userLanguageCode)[0].slice(3)].concat(
            this.languages.filter(i => i.slice(0,2) !== userLanguageCode).map(i => i.slice(3))
        )

        const fontSize = [ 'medium', 'xx-small', 'x-small', 'small', 'large', 'x-large', 'xx-large' ];
        const fontSizeChoice = [project.fontsize].concat(fontSize.filter(v => v !== project.fontsize));

        const saveMethod = () => this.save(this)
        const resetMethod = () => this.reset(this)

        return (
            <div className="UserSettings">
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
                                    size="64"
                                    round={true}
                                    ref={this.avatarRef}
                                    src={user !== undefined? user.username.avatarUri:""} />
                            
                            </Col>
                        </Row>
                        <br />
                        <Row className="name-row">
                            <Col xs={2} md={2}>
                                <LabelUx name={strings.name} />
                            </Col>
                            <Col xs={5} md={5}>
                                <TextboxUx ref={this.nameRef} isReadOnly={false}
                                    inputValue={user !== undefined? user.displayName: ""} />
                            </Col>
                            <Col xs={1} md={1}>
                                <LabelUx name={strings.role} />
                            </Col>
                            <Col xs={4} md={4}>
                                <TextboxUx isReadOnly={true}
                                    inputValue={user !== undefined? user.role.join(' + '): ""} />
                            </Col>
                        </Row>
                        <br />
                        <Row className="show-grid">
                            <Col xs={2} md={2}>&nbsp;</Col>
                            <Col xs={3} md={3}>
                                <LabelCaptionUx name={strings.language.toUpperCase()} />
                            </Col><Col xs={7} md={7}>
                                <DropdownUx ref={this.languageRef} key="1" collection={languageChoice} />
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
                                <TextboxUx ref={this.fontRef} isReadOnly={false} inputValue={project.fontfamily} />
                            </Col>
                            <Col xs={7} md={7}>
                                <DropdownUx ref={this.fontSizeRef} key="1" collection={fontSizeChoice} />
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
                                <TextboxUx ref={this.playpauseRef} isReadOnly={false} inputValue={playPauseKey} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>
                                <LabelUx name={strings.rewind} />
                            </Col>
                            <Col xs={10} md={10}>
                                <TextboxUx ref={this.backRef} isReadOnly={false} inputValue={backKey} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>
                                <LabelUx name={strings.fastForward} />
                            </Col>
                            <Col xs={10} md={10}>
                                <TextboxUx ref={this.aheadRef} isReadOnly={false} inputValue={forwardKey} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>
                                <LabelUx name={strings.slowDown} />
                            </Col>
                            <Col xs={10} md={10}>
                                <TextboxUx ref={this.slowRef} isReadOnly={false} inputValue={slowerKey} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>
                                <LabelUx name={strings.speedUp} />
                            </Col>
                            <Col xs={10} md={10}>
                                <TextboxUx ref={this.fastRef} isReadOnly={false} inputValue={fasterKey} />
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
                                <NextAction target={saveMethod} text={strings.save} />
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
        updates.push(tag + "=" + encodeURI(val !== null? val: ""))
    }

    private save(context: UserSettings) {
        const { selectedProject, selectedUser, users, updateUser } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];
        const project = user !== undefined? user.project.filter(u => u.id === selectedProject)[0]: 
        {fontfamily: "SIL Charis", fontsize: "medium", id:""};

        const updates = Array<string>();
        const avatarUri = this.avatarRef.current && this.avatarRef.current.props.uri;
        if (user.username.avatarUri !== avatarUri) {
            this.saveValue(updates, "avatarUri", avatarUri)
        }
        const name = context.nameRef.current && context.nameRef.current.state.message;
        if (user.displayName !== name){
            this.saveValue(updates, "name", name)
        }
        const language = context.languageRef.current && context.languageRef.current.selected;
        const languageCode = context.languages.filter(l => l.slice(3) === language)[0].slice(0,2)
        if (user.uilang.slice(0,2) !== languageCode) {
            this.saveValue(updates, "uilang", languageCode)
        }
        const font = context.fontRef.current && context.fontRef.current.state.message;
        if (project.fontfamily !== font) {
            updates.push("font=" + font)
        }
        const fontSize = context.fontSizeRef.current && context.fontSizeRef.current.selected;
        if (project.fontsize !== fontSize) {
            this.saveValue(updates, "fontsize", fontSize)
        }
        const playpause = context.playpauseRef.current && context.playpauseRef.current.state.message;
        if (user.hotkey.filter(k => k.id === "play-pause")[0].text !== playpause) {
            this.saveValue(updates, "playpause", playpause)
        }
        const back = context.backRef.current && context.backRef.current.state.message;
        if (user.hotkey.filter(k => k.id === "back")[0].text !== back) {
            this.saveValue(updates, "back", back)
        }
        const forward = context.aheadRef.current && context.aheadRef.current.state.message;
        if (user.hotkey.filter(k => k.id === "forward")[0].text !== forward) {
            this.saveValue(updates, "forward", forward)
        }
        const slower = context.slowRef.current && context.slowRef.current.state.message;
        if (user.hotkey.filter(k => k.id === "slower")[0].text !== slower) {
            this.saveValue(updates, "slower", slower)
        }
        const faster = context.fastRef.current && context.fastRef.current.state.message;
        if (user.hotkey.filter(k => k.id === "faster")[0].text !== faster) {
            this.saveValue(updates, "faster", faster)
        }
        if (updates.length > 0) {
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

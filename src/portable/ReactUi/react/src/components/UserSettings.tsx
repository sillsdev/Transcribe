import * as React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { IUserSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize';
import AvatarLink from './controls/AvatarLink';
import BackLink from './controls/BackLink';
import LinkAction from './controls/LinkAction';
import NextAction from './controls/NextAction';
import DropdownUx from './ui-controls/DropdownUx';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';
import LabelUx from './ui-controls/LabelUx';
import TextboxUx from './ui-controls/TextboxUx';
import './UserSettings.css';

class UserSettings extends React.Component<IStateProps, object> {
    public render() {
        const { users, selectedProject, selectedUser, strings } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];

        /* ONCE WE GET THE VALID DATE FROM THE XML FILE, WE NEED TO UNCOMMENT THE BELOW COMMENTED CODE AND NEED TO VERIFY THE DATE
        THEN WE HAVE TO SET THE CONSTANT(like PlayPauseKey, backKey, forwardKey, slowerKey, fasterKey and project) VALUE TO THE APPROPRIATE FIELDS */

        const project = user !== undefined? user.project.filter(u => u.id === selectedProject)[0]: 
        {fontfamily: "SIL Charis", fontsize: "medium", id:""};

        const playPauseKey = this.keyCode(user, "play-pause", "ESC");
        const backKey = this.keyCode(user, "back", "F1");
        const forwardKey = this.keyCode(user, "forward", "F2");
        const slowerKey = this.keyCode(user, "slower", "F3");
        const fasterKey = this.keyCode(user, "faster", "F4");

        const langaugeName = [
            "English",
            "French",
            "Tamil"
        ];
        const language = {
            'en':'English',
            'fr':'French',
            'ta':'Tamil',
        };
        const userLanguage = language[user !== undefined? user.uilang.slice(0,2): "en"];
        const languageChoice = [userLanguage].concat(langaugeName.filter(n => n !== userLanguage));

        const fontSize = [
            'medium',
            'xx-small',
            'x-small',
            'small',
            'large',
            'x-large',
            'xx-large'
       ];
       const fontChoice = [project.fontsize].concat(fontSize.filter(v => v !== project.fontsize));

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
                                <AvatarLink
                                    id={user !== undefined? user.username.id:""}
                                    name=""
                                    target="/settings"
                                    uri={user !== undefined? user.username.avatarUri:""} />
                            </Col>
                        </Row>
                        <br />
                        <Row className="name-row">
                            <Col xs={2} md={2}>
                                <LabelUx name={strings.name} />
                            </Col>
                            <Col xs={5} md={5}>
                                <TextboxUx isReadOnly={false}
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
                                <DropdownUx key="1" collection={languageChoice} />
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
                                <TextboxUx isReadOnly={false} inputValue={project.fontfamily} />
                            </Col>
                            <Col xs={7} md={7}>
                                <DropdownUx key="1" collection={fontChoice} />
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
                                <TextboxUx isReadOnly={false} inputValue={playPauseKey} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>
                                <LabelUx name={strings.rewind} />
                            </Col>
                            <Col xs={10} md={10}>
                                <TextboxUx isReadOnly={false} inputValue={backKey} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>
                                <LabelUx name={strings.fastForward} />
                            </Col>
                            <Col xs={10} md={10}>
                                <TextboxUx isReadOnly={false} inputValue={forwardKey} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>
                                <LabelUx name={strings.slowDown} />
                            </Col>
                            <Col xs={10} md={10}>
                                <TextboxUx isReadOnly={false} inputValue={slowerKey} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>
                                <LabelUx name={strings.speedUp} />
                            </Col>
                            <Col xs={10} md={10}>
                                <TextboxUx isReadOnly={false} inputValue={fasterKey} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={2}>&nbsp;</Col>
                            <Col xs={10} md={10}>
                                <LinkAction target="" text={strings.reset.toUpperCase()}/>
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={10} md={10}>&nbsp;</Col>
                            <Col xs={2} md={2} className="saveAction">
                                <NextAction target="" text={strings.save} />
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

export default connect(mapStateToProps)(UserSettings);

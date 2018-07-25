import * as React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchUsers } from '../actions/userActions';
import { IState } from '../model/state';
// import { IUserProjectSettings } from '../model/state';
import AvatarLink from './controls/AvatarLink';
import BackLink from './controls/BackLink';
import LinkAction from './controls/LinkAction';
import SaveAction from './controls/SaveAction';
import DropdownUx from './ui-controls/DropdownUx';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';
import LabelUx from './ui-controls/LabelUx';
import TextboxUx from './ui-controls/TextboxUx';
import './UserSettings.css';

class UserSettings extends React.Component<IStateProps, object> {

    public render() {
        const { users, selectedUser } = this.props;
        const user = users.filter(u => u.username.id === selectedUser)[0];

        /* ONCE WE GET THE VALID DATE FROM THE XML FILE, WE NEED TO UNCOMMENT THE BELOW COMMENTED CODE AND NEED TO VERIFY THE DATE
        THEN WE HAVE TO SET THE CONSTANT(like PlayPauseKey, backKey, forwardKey, slowerKey, fasterKey and project) VALUE TO THE APPROPRIATE FIELDS */

        /* const project = users.filter(u => u.projects.project.id === selectedProject)[0];

        const playPauseKey = user.settings.transcriber.hotkey.id === "play-pause" ? user.settings.transcriber.hotkey.id :
            "Esc";
        const backKey = user.settings.transcriber.hotkey.id === "back" ? user.settings.transcriber.hotkey.id :
            "F1";
        const forwardKey = user.settings.transcriber.hotkey.id === "forward" ? user.settings.transcriber.hotkey.id :
            "F2";
        const slowerKey = user.settings.transcriber.hotkey.id === "slower" ? user.settings.transcriber.hotkey.id :
            "F3";
        const fasterKey = user.settings.transcriber.hotkey.id === "faster" ? user.settings.transcriber.hotkey.id :
            "F4"; */

        const language = [
             'English',
             'Tamil',
            'French'
        ];

        const fontSize = [
            'medium',
            'xx-small',
           'x-small',
           'small',
           'large',
           'x-large',
           'xx-large'
       ];

        return (
            <div className="UserSettings">
                <BackLink target="/main" />
                <div className="GridStyle">
                    <Grid>
                        <Row className="show-grid">
                            <Col xs={1} md={1}>&nbsp;</Col>
                            <Col xs={11} md={11}>
                                <LabelCaptionUx name="USER" />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={1} md={1}>&nbsp;</Col>
                            <Col xs={11} md={11}>
                                <AvatarLink id={user.username.id} name="" target="/" uri={user.username.avatarUri} />
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col xs={1} md={1}>
                                <LabelUx name="Name" />
                            </Col>
                            <Col xs={5} md={5}>
                                <TextboxUx isReadOnly={false} inputValue={user.displayName} />
                            </Col>
                            <Col xs={1} md={1}>
                                <LabelUx name="Role" />
                            </Col>
                            <Col xs={5} md={5}>
                                <TextboxUx isReadOnly={true} inputValue={user.roles.role} />
                            </Col>
                        </Row>
                        <br />
                        <Row className="show-grid">
                            <Col xs={1} md={1}>&nbsp;</Col>
                            <Col xs={5} md={5}>
                                <LabelCaptionUx name="INTERFACE LANGUAGE" />
                            </Col><Col xs={6} md={6}>
                                <DropdownUx key="1" title="" id={2} collection={language} />
                            </Col>
                        </Row>
                        <br />
                        <Row className="show-grid">
                            <Col xs={1} md={1}>&nbsp;</Col>
                            <Col xs={11} md={11}>
                                <LabelCaptionUx name="TRANSCRIPTION" />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={1} md={1}>
                                <LabelUx name="Font" />
                            </Col>
                            <Col xs={6} md={6}>
                                <TextboxUx isReadOnly={false} inputValue={"project.fontfamily"} />
                            </Col>
                            <Col xs={4} md={4}>
                                <DropdownUx key="1" title="" id={2} collection={fontSize} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={1} md={1}>&nbsp;</Col>
                            <Col xs={11} md={11}>
                                <LabelCaptionUx name="KEYBOARD SHORTCUTS" />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={1}>
                                <LabelUx name="Play / Pause" />
                            </Col>
                            <Col xs={10} md={11}>
                                <TextboxUx isReadOnly={false} inputValue={"playPauseKey"} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={1}>
                                <LabelUx name="Rewind" />
                            </Col>
                            <Col xs={10} md={11}>
                                <TextboxUx isReadOnly={false} inputValue={"backKey"} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={1}>
                                <LabelUx name="Fast Forward" />
                            </Col>
                            <Col xs={10} md={11}>
                                <TextboxUx isReadOnly={false} inputValue={"forwardKey"} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={1}>
                                <LabelUx name="Slow Down" />
                            </Col>
                            <Col xs={10} md={11}>
                                <TextboxUx isReadOnly={false} inputValue={"slowerKey"} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={1}>
                                <LabelUx name="Speed Up" />
                            </Col>
                            <Col xs={10} md={11}>
                                <TextboxUx isReadOnly={false} inputValue={"fasterKey"} />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={1} md={1}>&nbsp;</Col>
                            <Col xs={11} md={11}>
                                <LinkAction target=""/>
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={1} md={1}>&nbsp;</Col>
                            <Col xs={5} md={5}>&nbsp;</Col>
                            <Col xs={6} md={6} className="saveAction">
                                <SaveAction target="" />
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        )
    }
}

interface IStateProps {
    selectedUser: string;
    selectedProject: string;
    users: IUser[];
};

const mapStateToProps = (state: IState): IStateProps => ({
    selectedProject: state.tasks.selectedProject,
    selectedUser: state.users.selectedUser,
    users: state.users.users,
});

export default connect(mapStateToProps, { fetchUsers })(UserSettings);

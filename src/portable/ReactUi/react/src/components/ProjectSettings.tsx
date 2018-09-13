import * as React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/taskActions';
import { IProjectSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize'
import ToggleSwitch from './controls/ToggleSwitch';
import PeopleList from './PeopleList';
import './ProjectSettings.sass';
import TasksList from './TasksList';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';

interface IProps extends IStateProps, IDispatchProps {
};

class ProjectSettings extends React.Component<IProps, object> {
    public render() {
        const{strings} = this.props
        return (
            <div id="ProjectSettings" className="ProjectSettings">
                <div className="grid">
                    <Grid>
                        <Row className="name-row">
                            <Col xs={1} md={1}>
                                <div className="EditPencil P1">
                                    <img src={require("./Images/Pencil.svg")} />
                                </div>
                            </Col>
                            <Col xs={6} md={6}>
                                <LabelCaptionUx name={"Luo Bible"} type="H1" />
                            </Col>
                            <Col xs={5} md={5}>
                                <LabelCaptionUx name={strings.projectSettings} type="H2" />
                            </Col>
                        </Row>
                        <Row className="name-row">
                            <Col xs={1} md={1}>
                                <div className="EditPencil P2">
                                    <img src={require("./Images/Pencil.svg")} /></div>
                            </Col>
                            <Col xs={11} md={11}>
                                <LabelCaptionUx name={strings.pairedWithParatextProject} type="Small" />
                            </Col>
                        </Row>
                        <Row className="name-row">
                            <Col xs={12} md={12}>
                                <ToggleSwitch switched={false} text={strings.autoSyncParatext} type="switch1" />
                            </Col>
                        </Row>
                        <Row className="name-row">
                            <Col xs={12} md={12}>
                                <ToggleSwitch switched={false} text={strings.allowClaimUnassignedTasks} type="switch2" />
                            </Col>
                        </Row>
                        <Row className="name-row">
                            <Col xs={6} md={6}><PeopleList /></Col>
                            <Col xs={6} md={6}><TasksList /></Col>
                        </Row>
                        <br />
                    </Grid>
                </div>
            </div >
        )
    }
}

interface IStateProps {
    selectedUser: string;
    projects: IProject[];
    loaded: boolean;
    strings: IProjectSettingsStrings;
};

const mapStateToProps = (state: IState): IStateProps => ({
    loaded: state.tasks.loaded,
    projects: state.tasks.projects,
    selectedUser: state.users.selectedUser,
    strings:  userStrings(state, {layout: "projectSettings"}),
});

interface IDispatchProps {
    fetchTasks: typeof actions.fetchTasks;
    selectProject: typeof actions.selectProject;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        fetchTasks: actions.fetchTasks,
        selectProject: actions.selectProject,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSettings);
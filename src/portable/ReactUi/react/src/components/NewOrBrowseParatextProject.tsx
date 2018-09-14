import * as React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import Ionicon from 'react-ionicons'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/paratextProjectActions';
import { IProjectSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize';
import ButtonLink from './controls/ButtonLink';
import './NewOrBrowseParatextProject.sass';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';

interface IProps extends IStateProps, IDispatchProps {
};


class NewOrBrowseParatextProjects extends React.Component<IProps, object> {
    
    public render() {
        const { strings } = this.props;

        return (
            <div className="NewOrBrowseParatextProjects">
                <Grid className="grid">
                    <Row className="name-row">
                        
                        <Col xs={12} md={12}>
                            <LabelCaptionUx name={strings.noProjectsFound} />
                        </Col>
                        
                    </Row>
                    <Row className="name-row">
                        <Col xs={12} md={12}>
                        <Ionicon icon="ios-checkmark-circle-outline" fontSize="100px" color="#C9C9C9"/>
                        </Col>
                    </Row>
                    <br />
                    <Row className="name-row">                        
                        <Col xs={6} md={6}>       
                        <span className="ButtonLink">           
                           <ButtonLink text={strings.browseForProject.toUpperCase()} target="/" type="text-light"/>
                           </span>                           
                        </Col>
                        <Col xs={6} md={6}>
                        <span className="ButtonLink"> 
                                <ButtonLink text={strings.createEmptyProject.toUpperCase()} target="/" type="primary" />
                            </span>
                        </Col>                     
                    </Row>
                </Grid>
            </div>
        );
    }

    
}



interface IStateProps {
    loaded: boolean;
    paratextProjects: IParatextProject[];
    strings: IProjectSettingsStrings;
};

const mapStateToProps = (state: IState): IStateProps => ({
    loaded: state.paratextProjects.loaded,
    paratextProjects: state.paratextProjects.paratextProjects,
    strings: userStrings(state, { layout: "projectSettings" }),
});

interface IDispatchProps {

    fetchParatextProjects: typeof actions.fetchParatextProjects,
    selectParatextProject: typeof actions.selectParatextProject;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        fetchParatextProjects: actions.fetchParatextProjects,
        selectParatextProject: actions.selectParatextProject,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewOrBrowseParatextProjects);
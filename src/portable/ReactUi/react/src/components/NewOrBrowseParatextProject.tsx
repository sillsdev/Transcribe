import * as React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import Ionicon from 'react-ionicons'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/paratextProjectActions';
import { IState } from '../model/state';
import ButtonLink from './controls/ButtonLink';
import './NewOrBrowseParatextProject.sass';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';

interface IProps extends IStateProps, IDispatchProps {
};


class NewOrBrowseParatextProjects extends React.Component<IProps, object> {
    
    public render() {

        

        return (
            <div className="NewOrBrowseParatextProjects">
                <Grid className="grid">
                    <Row className="name-row">
                        
                        <Col xs={12} md={12}>
                            <LabelCaptionUx name="We didn’t find any Paratext projects on your computer." />
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
                           <ButtonLink text="BROWSE FOR A PROJECT" target="/" type="text-light"/>
                           </span>                           
                        </Col>
                        <Col xs={6} md={6}>
                        <span className="ButtonLink"> 
                                <ButtonLink text="Create empty project" target="/" type="primary" />
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
};

const mapStateToProps = (state: IState): IStateProps => ({
    loaded: state.paratextProjects.loaded,
    paratextProjects: state.paratextProjects.paratextProjects
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
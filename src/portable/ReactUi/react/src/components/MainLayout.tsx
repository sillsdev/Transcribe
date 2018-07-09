import * as React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import Editor from './Editor'
import NavPanel from './NavPanel'
import TaskPanel from './TaskPanel'

class MainLayout extends React.Component<any> {
    public render() {
        return (<div className="MainLayout">
                    <Grid>
                        <Row className="show-grid">
                            <Col md={2}>
                                <NavPanel {...this.props} />
                            </Col>
                            <Col md={3}>
                                <TaskPanel {...this.props} />
                            </Col>
                            <Col md={7}>
                                <Editor {...this.props} />
                            </Col>
                        </Row>
                    </Grid>
                </div>
        )
    }
};

const mapStateToProps = (state: any): any => ({
});

export default connect(mapStateToProps)(MainLayout);

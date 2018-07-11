import * as React from 'react';
import { connect } from 'react-redux';
import AudioPanel from './AudioPanel'
import './MainLayout.css';
import NavPanel from './NavPanel'
import TaskPanel from './TaskPanel'

class MainLayout extends React.Component<any> {
    public render() {
        return (<div className="MainLayout">
                    <div className="NavCol">
                        <NavPanel {...this.props} />
                    </div>
                    <div className="TaskCol">
                        <TaskPanel {...this.props} />
                    </div>
                    <div className="MainCol">
                        <AudioPanel {...this.props} />
                    </div>
                </div>
        )
    }
};

const mapStateToProps = (state: any): any => ({
});

export default connect(mapStateToProps)(MainLayout);

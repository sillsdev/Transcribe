import * as React from 'react';
import { connect } from 'react-redux';
import './AudioPanel.css';
import ControlPane from './ControlPane';
import EditorPane from './EditorPane';
import ProgressPane from './ProgressPane';

class AudioPanel extends React.Component<any> {
    public render() {
        return (<div className="AudioPanel">
                    <div className="ProgressRow">
                        <ProgressPane {...this.props} />
                    </div>
                    <div className="EditorRow">
                        <EditorPane {...this.props} />
                    </div>
                    <div className="ControlRow">
                        <ControlPane {...this.props} />
                    </div>
                </div>
        )
    }
};

const mapStateToProps = (state: IState) => ({
});

export default connect(mapStateToProps)(AudioPanel);

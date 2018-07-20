import * as React from 'react';
import { JumpChange, PlaySpeedRateChange, playStatus } from '../actions/audioActions';
import './AudioPanel.css';
import ControlPane from './ControlPane';
import EditorPane from './EditorPane';
import ProgressPane from './ProgressPane';

interface IProps extends IStateProps, IDispatchProps {
};

class AudioPanel extends React.Component<IProps, object> {
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

interface IStateProps {
    playing: boolean;
    playSpeedRate: number;
    selectedTask: string;
    jump: number;
};

interface IDispatchProps {
    playStatus: typeof playStatus,
    PlaySpeedRateChange: typeof PlaySpeedRateChange;
    JumpChange: typeof JumpChange;
};

export default AudioPanel;

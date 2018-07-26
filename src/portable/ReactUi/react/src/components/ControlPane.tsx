import * as React from 'react';
import { jumpChange, playSpeedRateChange, playStatus } from '../actions/audioActions';
import './ControlPane.css';
import JumpAhead from './controls/JumpAhead';
import JumpBack from './controls/JumpBack';
import NextAction from './controls/NextAction';
import PlayPause from './controls/PlayPause';
import SpeedBar from './controls/SpeedBar';

interface IProps extends IStateProps, IDispatchProps {
};

class ControlPane extends React.Component<IProps, object> {
    public render() {
        return (
            <div className="ControlPane"> 
                <SpeedBar {...this.props} />
                <div className="Spacer" />
                <JumpBack {...this.props} />
                <div className="circle">
                    <PlayPause {...this.props} />
                </div>
                <JumpAhead {...this.props} />
                <div className="Spacer" />
                <NextAction target="" text={"Submit"} />
            </div>
            )
    }
};

interface IStateProps {
    playing: boolean;
    playSpeedRate: number;
};

interface IDispatchProps {
    playStatus: typeof playStatus,
    playSpeedRateChange: typeof playSpeedRateChange;
    jumpChange: typeof jumpChange;
};

export default ControlPane;

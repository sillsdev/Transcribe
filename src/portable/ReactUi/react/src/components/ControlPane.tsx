import * as React from 'react';
import { PlaySpeedRateChange, playStatus } from '../actions/audioActions';
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
                <JumpBack target="" />
                <div className="circle">
                    <PlayPause {...this.props} />
                </div>
                <JumpAhead target="" />
                <div className="Spacer" />
                <NextAction target="" />
            </div>
            )
    }
};

interface IStateProps {
    playing?: boolean;
    playSpeedRate?: number;
};

interface IDispatchProps {
    playStatus: typeof playStatus,
    PlaySpeedRateChange: typeof PlaySpeedRateChange;
};

export default ControlPane;

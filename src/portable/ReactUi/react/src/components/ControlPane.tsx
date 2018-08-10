import * as React from 'react';
import { jumpChange, playSpeedRateChange, playStatus } from '../actions/audioActions';
import { ITranscriberStrings } from '../model/localize';
import './ControlPane.sass';
import JumpAhead from './controls/JumpAhead';
import JumpBack from './controls/JumpBack';
import NextAction from './controls/NextAction';
import PlayPause from './controls/PlayPause';
import SpeedBar from './controls/SpeedBar';

interface IProps extends IStateProps, IDispatchProps {
};

class ControlPane extends React.Component<IProps, any> {

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
                <NextAction target={this.submit} text={this.props.strings.submit} />
            </div>
            )
    }

    private submit = () => {
        alert("Submitting logic goes here")
    }
};

interface IStateProps {
    playing: boolean;
    playSpeedRate: number;
    strings: ITranscriberStrings;
};

interface IDispatchProps {
    playStatus: typeof playStatus,
    playSpeedRateChange: typeof playSpeedRateChange;
    jumpChange: typeof jumpChange;
};

export default ControlPane;

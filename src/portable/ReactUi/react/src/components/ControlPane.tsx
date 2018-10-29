import * as React from 'react';
import * as actions from '../actions/audioActions';
import { log } from '../actions/logAction';
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

        let submitWrapper = <div className="SubmitSpacer" />;
        if(this.props.assignedReview.length + this.props.assignedTranscribe.length > 0)
        {
            submitWrapper = <NextAction target={this.submit} text={this.props.strings.submit} type="safe"/>;
        }

        log("ControlePane")

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
                {submitWrapper}
            </div>
            )
    }

    private submit = () => {
        const { setSubmitted } = this.props;
        setSubmitted(true)
    }
};

interface IStateProps {
    assignedReview: ITask[];
    assignedTranscribe: ITask[];
    direction: string;
    playing: boolean;
    playSpeedRate: number;
    strings: ITranscriberStrings;
    selectedUser: string;
    users: IUser[];
};

interface IDispatchProps {
    playStatus: typeof actions.playStatus,
    playSpeedRateChange: typeof actions.playSpeedRateChange;
    jumpChange: typeof actions.jumpChange;
    setSubmitted: typeof actions.setSubmitted;
};

export default ControlPane;

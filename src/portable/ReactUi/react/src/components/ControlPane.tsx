import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/audioActions';
/* import { jumpChange, playSpeedRateChange, playStatus } from '../actions/audioActions'; */
import { ITranscriberStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize';
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
        const { isSubmitted } = this.props;
        isSubmitted(true)
        // this.props.isSubmitted.bind(true)
        alert("Submitting logic goes here")
    }
};

interface IStateProps {
    playing: boolean;
    playSpeedRate: number;
    strings: ITranscriberStrings;
};

const mapStateToProps = (state: IState): IStateProps => ({
    playSpeedRate: state.audio.playSpeedRate,
    playing: state.audio.playing,
    strings: userStrings(state, { layout: "transcriber" }),
});

interface IDispatchProps {
    playStatus: typeof actions.playStatus,
    playSpeedRateChange: typeof actions.playSpeedRateChange;
    jumpChange: typeof actions.jumpChange;
    isSubmitted: typeof actions.isSubmitted;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        isSubmitted: actions.isSubmitted,
        jumpChange: actions.jumpChange,
        playSpeedRateChange: actions.playSpeedRateChange,
        playStatus: actions.playStatus,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlPane);
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PlaySpeedRateChange, playStatus, updateName } from '../actions/audioActions';
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
                    {/* <PlayPause target="" onClick={actions.playStatus}/> */}
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
    playSpeedRate?: boolean;
};

const mapStateToProps = (state: any): IStateProps => ({
    playSpeedRate: state.audio.playSpeedRate,
    playing: state.audio.playing,
});

interface IDispatchProps {
    playStatus: typeof playStatus,
    updateName: typeof updateName;
    PlaySpeedRateChange: typeof PlaySpeedRateChange;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        PlaySpeedRateChange,
        playStatus,
        updateName
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlPane);

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Action from '../../actions/audioActions';
import './SpeedBar.css';

interface IProps extends IStateProps, IDispatchProps {
};

class SpeedBar extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    public onChange(e: any) {
        const { PlaySpeedRateChange } = this.props;
        PlaySpeedRateChange(e.target.value)
    }

    public render() {
        const { playSpeedRate } = this.props;

        return (
            <div className="SpeedBar">
                <i className="slider-origin" />
                <input
                    id="speed"
                    type="range"
                    min=".5"
                    max="2.0"
                    step=".1"
                    defaultValue={playSpeedRate.toString()}
                    value={playSpeedRate.toString()}
                    onChange={this.onChange} />
            </div>
        )
    }
};

interface IStateProps {
    playSpeedRate: number;
};

const mapStateToProps = (state: IState): IStateProps => ({
    playSpeedRate: state.audio.playSpeedRate,
});

interface IDispatchProps {
    PlaySpeedRateChange: typeof Action.PlaySpeedRateChange;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
    PlaySpeedRateChange: Action.PlaySpeedRateChange,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SpeedBar);


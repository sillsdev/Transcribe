import * as React from 'react';
import { PlaySpeedRateChange } from '../../actions/audioActions';
import './SpeedBar.css';

interface IProps extends IStateProps, IDispatchProps {
};

class SpeedBar extends React.Component<IProps, any> {
    public onChange(e: any) {
        this.setState({
            myValue: e.target.value,
            playSpeedRate: parseFloat(e.target.value),
        })
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
                    value={playSpeedRate}
                    step=".1"
                    onDoubleClick={this.props.PlaySpeedRateChange.bind(this,1)}
                    onMouseUp={this.props.PlaySpeedRateChange.bind(this, playSpeedRate)}
                    onChange={this.onChange} />
            </div>
        )
    }
};

interface IStateProps {
    playSpeedRate?: number;
};

interface IDispatchProps {
    PlaySpeedRateChange: typeof PlaySpeedRateChange;
};

export default SpeedBar;

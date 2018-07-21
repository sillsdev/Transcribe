import * as React from 'react';
import { PlaySpeedRateChange } from '../../actions/audioActions';
import './SpeedBar.css';

interface IProps extends IStateProps, IDispatchProps {
};

const initialState = {
    playSpeedRate: 1,
}

class SpeedBar extends React.Component<IProps, typeof initialState> {
    public readonly state = initialState;
    constructor(props: IProps) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    public onChange(e: any) {
        this.setState({
            playSpeedRate: parseFloat(e.target.value),
        })
    }

    public resetDefault() {
        this.setState({
            ...initialState,
        })
    }

    public render() {
        const { playSpeedRate } = this.state;
        return (
            <div className="SpeedBar">
                <i className="slider-origin" />
                <input
                    id="speed"
                    type="range"
                    min=".5"
                    max="2.0"
                    step=".1"
                    defaultValue={this.props.playSpeedRate.toString()}
                    onMouseUp={this.props.PlaySpeedRateChange.bind(this, playSpeedRate)}
                    onChange={this.onChange} />
            </div>
        )
    }
};

interface IStateProps {
    playSpeedRate: number;
};

interface IDispatchProps {
    PlaySpeedRateChange: typeof PlaySpeedRateChange;
};

export default SpeedBar;

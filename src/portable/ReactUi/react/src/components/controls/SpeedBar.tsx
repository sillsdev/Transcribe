import * as React from 'react';
import { PlaySpeedRateChange } from '../../actions/audioActions';
import './SpeedBar.css';

interface IProps {
    PlaySpeedRateChange: typeof PlaySpeedRateChange;
};

const initialState = {
    myValue: "1",
    playSpeedRate: 1,
}

class SpeedBar extends React.Component<IProps, typeof initialState> {
    public readonly state = initialState;
    constructor(props: IProps) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.resetDefault = this.resetDefault.bind(this);
    }
    public onChange(e: any) {
        this.setState({
            myValue: e.target.value,
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
                    defaultValue="1"
                    onDoubleClick={this.resetDefault}
                    onMouseUp={this.props.PlaySpeedRateChange.bind(this, playSpeedRate)}
                    onChange={this.onChange} />
            </div>
        )
    }
};

export default SpeedBar;

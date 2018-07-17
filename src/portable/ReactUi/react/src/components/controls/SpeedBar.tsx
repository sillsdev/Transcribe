import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { PlaySpeedRateChange } from '../../actions/audioActions';
import './SpeedBar.css';

interface IProps {
    PlaySpeedRateChange: (playSpeedRate: number) => any;
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
        this.setDefault = this.setDefault.bind(this);
    }
    public onChange(e: any) {
        this.setState({
            myValue: e.target.value,
            playSpeedRate: parseFloat(e.target.value),
        })

    }

    public setDefault() {
        this.setState({
            playSpeedRate: 1
        })
    }
    public render() {
        const { playSpeedRate } = this.state;
        return (
            <div className="SpeedBar">

                {/* <input id="speed" type="range" min=".5" max="2.0" step=".1" defaultValue="1" onDoubleClick={this.setDefault} onMouseUp={this.props.PlaySpeedRateChange.bind(this, playSpeedRate)} onChange={this.onChange} /> */}
               
                <i className="slider-origin" />
                <input id="speed" type="range" min=".5" max="2.0" step=".1" defaultValue="1" onDoubleClick={this.setDefault} onMouseUp={this.props.PlaySpeedRateChange.bind(this, playSpeedRate)} onChange={this.onChange} />
               
            </div>
        )
    }
};

const mapStateToProps = (state: any) => ({
    playSpeedRate: state.audio.playSpeedRate
});

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators({ PlaySpeedRateChange }, dispatch)
}



export default connect(mapStateToProps, mapDispatchToProps)(SpeedBar);

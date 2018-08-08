import * as React from 'react';
import { jumpChange, playSpeedRateChange, playStatus } from '../actions/audioActions';
import { ITranscriberStrings } from '../model/localize';
import './ControlPane.css';
import JumpAhead from './controls/JumpAhead';
import JumpBack from './controls/JumpBack';
import NextAction from './controls/NextAction';
import PlayPause from './controls/PlayPause';
import SpeedBar from './controls/SpeedBar';

interface IProps extends IStateProps, IDispatchProps {
};

interface IState {
    seconds: number;
}

class ControlPane extends React.Component<IProps, IState> {
    public readonly state: IState = {
        seconds: 0
    }

    private interval: any;

    constructor(props: IProps) {
        super(props);
        this.state = { seconds: 0 };
    }

    public tick() {
        this.setState(prevState => ({
            seconds: prevState.seconds + 1
        }));
    }

    public componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000);
    }

    public componentWillUpdate() {
        if (this.state.seconds === 60) {
            this.savePage();
            this.setState({
                seconds: 0
            });
        }
    }

    public componentWillUnmount() {
        clearInterval(this.interval);
    }

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
                {/* <div>
                    Seconds: {this.state.seconds}
                </div> */}
                <NextAction target={this.submit} text={this.props.strings.submit} />
            </div>
            )
    }

    private submit = () => {
        alert("Submitting logic goes here")
    }

    private savePage = () => {
        alert("Page saved...")
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

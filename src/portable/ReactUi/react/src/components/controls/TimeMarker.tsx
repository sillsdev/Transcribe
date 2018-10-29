import * as React from 'react';
import Duration from './Duration';
import './TimeMarker.sass';

interface IProps{
    direction?: string;
    playedSeconds: number;
    totalSeconds:number;
    timer: string;
}

class TimeMarker extends React.Component<IProps, any> {
    public render() {
        const { direction, totalSeconds, playedSeconds, timer } = this.props;
        const changingSeconds = (totalSeconds >= playedSeconds)? (totalSeconds - playedSeconds): 0;
        const displaySeconds = timer === "countdown"? changingSeconds : playedSeconds

        if (direction && direction === "rtl") {
            return (
                <div id="Time" className="TimeMarker">
                    <Duration id="total" seconds={totalSeconds} direction={direction} />/<Duration id="pos" seconds={displaySeconds} direction={direction} />
                </div>
            )
        }

        return (
            <div id="Time" className="TimeMarker">
                <Duration id="pos" seconds={displaySeconds} />/<Duration id="total" seconds={totalSeconds} />
            </div>
        )
    }
};

export default TimeMarker;

import * as React from 'react';
import Duration from './Duration';
import './TimeMarker.sass';

interface IProps{
    playedSeconds: number,
    totalSeconds:number,
    timer: string
}

class TimeMarker extends React.Component<IProps, any> {
    public render() {
        const { totalSeconds, playedSeconds, timer } = this.props;
        const displaySeconds = timer === "countdown"? totalSeconds - playedSeconds : playedSeconds
        return (
            <div className="TimeMarker">
                <Duration seconds={displaySeconds} />/<Duration seconds={totalSeconds} />
            </div>
        )
    }
};

export default TimeMarker;

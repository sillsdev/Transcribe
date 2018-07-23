import * as React from 'react';
import Duration from '../controls/Duration';
import './TimeMarker.css';

interface IProps{
    playedSeconds: number,
    totalSeconds:number
}

class TimeMarker extends React.Component<IProps, any> {
    public render() {
        const { totalSeconds, playedSeconds } = this.props;
        return (
            <div className="TimeMarker">
                <Duration seconds={playedSeconds} />/<Duration seconds={totalSeconds} />
            </div>
        )
    }
};

export default TimeMarker;

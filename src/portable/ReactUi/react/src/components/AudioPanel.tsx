import * as React from 'react';
import { connect } from 'react-redux';
import './AudioPanel.css';
import ControlPane from './ControlPane';
import EditorPane from './EditorPane';
import ProgressPane from './ProgressPane';


interface IProps extends IStateProps {
    playStatus: (playing: boolean) => any;
    played: number;
    player: any
};

interface IStateProps {
    playing?: boolean;
    seeking: boolean;
    totalSeconds: number;
    playedSeconds:number;
    playSpeedRate?: number;
};


class AudioPanel extends React.Component<IProps, object> {
    public render() {
        return (<div className="AudioPanel">
                    <div className="ProgressRow">
                        <ProgressPane {...this.props} />
                    </div>
                    <div className="EditorRow">
                        <EditorPane {...this.props} />
                    </div>
                    <div className="ControlRow">
                        <ControlPane {...this.props} />
                    </div>
                </div>
        )
    }
};

const mapStateToProps = (state: IState): any => ({
    playSpeedRate: state.audio.playSpeedRate,
    playing: state.audio.playing,
});

export default connect(mapStateToProps)(AudioPanel);

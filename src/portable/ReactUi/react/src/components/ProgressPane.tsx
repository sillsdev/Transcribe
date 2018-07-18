import * as React from 'react';
import { connect } from 'react-redux';
import './ProgressPane.css';
import ReactPlayer from './ReactPlayer';

interface IProps extends IStateProps {
    selectedTask: string;
    playStatus: (playing: boolean) => any;
    played: number;
    player: any;
    seeking: boolean;
};

interface IStateProps {
    playing?: boolean;
    played: number;
    seeking: boolean;
    playSpeedRate?: number;
};

const initialState = {
    audioPlayedSeconds: 0,
    totalSeconds: 0,
}


class ProgressPane extends React.Component<IProps, typeof initialState> {
    public readonly state = initialState;
    public player: any;

    public onProgressMouseDown = (e: any) => {
            alert(e.target.value);
            // this.setState({ seeking: true })
        }
        /*  public onProgressChange = (e: any) => {
            this.setState({ played: parseFloat(e.target.value) })
        }
        public onProgressMouseUp = (e: any) => {
            this.setState({ seeking: false })
            this.player.seekTo(parseFloat(e.target.value))
        } */

    public onProgress = (state: any) => {
        this.setState({
            audioPlayedSeconds: state.playedSeconds,
            totalSeconds: state.loadedSeconds,
        })
    }

    public ref = (player: any) => {
        this.player = player
    }

    public onEnded = () => {
        // tslint:disable-next-line:no-console
        console.log('onEnded')
        // this.setState({ playing: false })
    }


    public render() {
        const { selectedTask } = this.props;
        const { audioPlayedSeconds, totalSeconds } = this.state;
        const audioFile = '/api/audio/' + selectedTask + '.mp3'
        return (
            <div>

            <div className="ProgressPane"> 
                    <div>
                        <progress className="progressBar" max={totalSeconds} onMouseDown={this.onProgressMouseDown} value={audioPlayedSeconds} />
                        {/* <progress max={totalSeconds} value={audioPlayedSeconds} onMouseDown={this.onProgressMouseDown} onChange={this.onProgressChange} onMouseUp={this.onProgressMouseUp} /> */}
                    </div>
                    <div className="RealPlayer">
                        <ReactPlayer ref={this.ref} url={audioFile} controls={true} onEnded={this.props.playStatus.bind(this, false)} playbackRate={this.props.playSpeedRate} playing={this.props.playing} onProgress={this.onProgress} />
                    </div>
                </div>
            </div>
            )
    }
};

const mapStateToProps = (state: any) => ({
    audioPlayedSeconds: state.playedSeconds,
    selectedTask: state.tasks.selectedTask,
    totalSeconds: state.loadedSeconds
  });
  
  export default connect(mapStateToProps)(ProgressPane);

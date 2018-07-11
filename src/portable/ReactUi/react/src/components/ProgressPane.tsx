import * as React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { connect } from 'react-redux';
import './ProgressPane.css';

interface IProps {
    selectedTask: string;
}

class ProgressPane extends React.Component<IProps, object> {
    public render() {
        const { selectedTask } = this.props;
        const audioFile = '/api/audio/' + selectedTask + '.mp3'
        return (
            <div className="ProgressPane"> 
                <ReactAudioPlayer src={audioFile} controls={true} />
            </div>
            )
    }
};

const mapStateToProps = (state: any) => ({
    selectedTask: state.tasks.selectedTask,
  });
  
  export default connect(mapStateToProps)(ProgressPane);

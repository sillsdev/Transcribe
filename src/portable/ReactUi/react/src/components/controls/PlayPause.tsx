import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { playStatus } from '../../actions/audioActions';
/* import { Link } from 'react-router-dom'; */
import './PlayPause.css';

interface IProps {
    playing: boolean;
    playStatus: (playing: boolean) => any;
};

class PlayPause extends React.Component<IProps, object> {
    public render() {
        const { playing } = this.props;
        const playCharacter = playing? "\u2225" : "\u25B6";
        return (
            <div className="PlayPause" onClick={this.props.playStatus.bind(this, !playing)}>
               {playCharacter}
            </div>
            )
    }
};

const mapStateToProps = (state: any) => ({
    playing: state.audio.playing
});

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators({ playStatus }, dispatch)
  }


export default connect(mapStateToProps, mapDispatchToProps)(PlayPause);

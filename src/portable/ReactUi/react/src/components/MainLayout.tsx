import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PlaySpeedRateChange, playStatus } from '../actions/audioActions';
import AudioPanel from './AudioPanel'
import './MainLayout.css';
import NavPanel from './NavPanel'
import TaskPanel from './TaskPanel'

interface IProps extends IStateProps, IDispatchProps {
};

class MainLayout extends React.Component<IProps, any> {
    public render() {
        return (<div className="MainLayout">
                    <div className="NavCol">
                        <NavPanel {...this.props} />
                    </div>
                    <div className="TaskCol">
                        <TaskPanel {...this.props} />
                    </div>
                    <div className="MainCol">
                        <AudioPanel {...this.props} />
                    </div>
                </div>
        )
    }
};

interface IStateProps {
    playing?: boolean;
    playSpeedRate?: number;
    selectedTask: string;
};

const mapStateToProps = (state: IState): IStateProps => ({
    playSpeedRate: state.audio.playSpeedRate,
    playing: state.audio.playing,
    selectedTask: state.tasks.selectedTask,
});

interface IDispatchProps {
    playStatus: typeof playStatus,
    PlaySpeedRateChange: typeof PlaySpeedRateChange;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        PlaySpeedRateChange,
        playStatus,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);

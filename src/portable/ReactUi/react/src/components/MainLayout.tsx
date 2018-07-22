import * as React from 'react';
import { HotKeys } from 'react-hotkeys';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/audioActions';
import AudioPanel from './AudioPanel'
import './MainLayout.css';
import NavPanel from './NavPanel'
import TaskPanel from './TaskPanel'

interface IProps extends IStateProps, IDispatchProps {
};

class MainLayout extends React.Component<IProps, any> {
    public render() {
        const { jumpChange, playing, playSpeedRate, playSpeedRateChange, playStatus } = this.props;

        const keyMap = {
            moveUp: 'up',
        }

        const handlers = {
            'esc': (event: any) => {
                playStatus(!playing);
            },
            'f1': (event: any) => {
                let speedDown = playSpeedRate - 0.1;
                if(playSpeedRate <= 0.5)
                {
                    speedDown = 0.5
                }
                playSpeedRateChange(speedDown);
            },
            'f2': (event: any) => {
                let speedUp = playSpeedRate + 0.1;
                if(playSpeedRate >= 2.0)
                {
                    speedUp = 2.0
                }
                playSpeedRateChange(speedUp);
            },
            'f3': (event: any) => {
                jumpChange(-2);
            },
            'f4': (event: any) => {
                jumpChange(2);
            }
        };

        return (
            <HotKeys keyMap={keyMap} handlers={handlers}>
                <div className="MainLayout" tabIndex={1}>
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
            </HotKeys>
        )
    }
};

interface IStateProps {
    playing: boolean;
    playSpeedRate: number;
    selectedTask: string;
    jump: number;
};

const mapStateToProps = (state: IState): IStateProps => ({
    jump: state.audio.jump,
    playSpeedRate: state.audio.playSpeedRate,
    playing: state.audio.playing,
    selectedTask: state.tasks.selectedTask,
});

interface IDispatchProps {
    playStatus: typeof actions.playStatus,
    playSpeedRateChange: typeof actions.playSpeedRateChange;
    jumpChange: typeof actions.jumpChange;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        jumpChange: actions.jumpChange,
        playSpeedRateChange: actions.playSpeedRateChange,
        playStatus: actions.playStatus,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);

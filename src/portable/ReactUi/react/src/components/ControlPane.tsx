import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './ControlPane.css';
import JumpAhead from './controls/JumpAhead';
import JumpBack from './controls/JumpBack';
import NextAction from './controls/NextAction';
import PlayPause from './controls/PlayPause';
import SpeedBar from './controls/SpeedBar';


const actions = {
    updateAge: ():boolean => true,
    updateName: ():boolean => true,
};

interface IProps extends IStateProps, IDispatchProps {
};

class ControlPane extends React.Component<IProps, object> {
    public render() {
        return (
            <div className="ControlPane"> 
                <SpeedBar onchange={actions.updateName} />
                <div className="Spacer" />
                <JumpBack target="" />
                <div className="circle">
                    <PlayPause target="" />
                </div>
                <JumpAhead target="" />
                <div className="Spacer" />
                <NextAction target="" />
            </div>
            )
    }
};

interface IStateProps {
    age?: number;
    name?: string;
};

const mapStateToProps = (state: IState): IStateProps => ({
});

interface IDispatchProps {
    updateAge: typeof actions.updateAge;
    updateName: typeof actions.updateName;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        ...actions,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlPane);

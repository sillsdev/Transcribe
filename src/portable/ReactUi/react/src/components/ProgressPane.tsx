import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './ProgressPane.css';

const actions = {
    updateAge: ():boolean => true,
    updateName: ():boolean => true,
};

interface IProps extends IStateProps, IDispatchProps {
};

class ProgressPane extends React.Component<IProps, object> {
    public render() {
        const { name, age, updateName, updateAge} = this.props;
        return (
            <div className="ProgressPane"> 
                <input value={name} /> <button onClick={updateName} />
                <input value={age} /> <button onClick={updateAge} />
            </div>
            )
    }
};

interface IStateProps {
    age?: number;
    name?: string;
};

const mapStateToProps = (state: any): IStateProps => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(ProgressPane);

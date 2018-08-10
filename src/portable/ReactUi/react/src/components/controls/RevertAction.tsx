import * as React from 'react';
import './RevertAction.sass';

interface IProps {
    target: React.MouseEventHandler;
    text: string;
    selected: boolean;
};

class RevertAction extends React.Component<IProps, object> {
    public render() {
        const { selected, target, text } = this.props;
        return (
            <div className="RevertAction" onClick={target}>
                <div className={selected? "btn-primary": "unselected"}>
                    {text}
                </div>
            </div>
        )
    }
};

export default RevertAction;

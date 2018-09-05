import * as React from 'react';
import './NextAction.sass';

interface IProps {
    target: (context: any) => any;
    text: string;
    type: string;
};

class NextAction extends React.Component<IProps, object> {
    public render() {
        const { target, text, type } = this.props;
        return (
            <div id="NextAction" className="NextAction">
                <button className={type} onClick={target}>
                {text}
                </button>
            </div>
        )
    }
};

export default NextAction;

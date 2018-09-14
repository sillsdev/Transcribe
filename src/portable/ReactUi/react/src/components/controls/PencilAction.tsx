import * as React from 'react';
import './PencilAction.sass';

interface IProps {
    target: (context: any) => any;
};

class PencilAction extends React.Component<IProps, object> {
    public render() {
        const { target } = this.props;
        return (
            <div id="PencilAction" className="PencilAction" onClick={target}>
                <img src={"/assets/pencil.svg"} />
            </div>
        )
    }
};

export default PencilAction;

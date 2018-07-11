import * as React from 'react';
import './SpeedBar.css';

interface IProps {
    onchange: () => any;
};

class SpeedBar extends React.Component<IProps, object> {
    public render() {
        return (
            <div className="SpeedBar">
                <input id="speed" type="range" min=".5" max="2.0" step=".1" value="1"
                onChange={this.props.onchange} />
            </div>
            )
    }
};

export default SpeedBar;

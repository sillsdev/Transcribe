import * as React from 'react';
import './EmptyTaskItem.sass';

interface IProps {
    id: string;
};

class EmptyTaskItem extends React.Component<IProps, object> {
    public render() {
        const { id } = this.props;
        return (
            <div id={id} className={"EmptyTaskItem"}>
                <div className="ImageStyle">
                    <img src={"/assets/EmptyTaskIcon.svg"} />
                </div>
                <div className="CaptionStyle">
                    <label className="labelNone">None</label>
                </div>
            </div>
        )
    }
};

export default EmptyTaskItem;

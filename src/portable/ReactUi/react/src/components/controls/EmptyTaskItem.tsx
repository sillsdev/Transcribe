import * as React from 'react';
import './EmptyTaskItem.sass';

interface IProps {
    id: string;
    text: string;
};

class EmptyTaskItem extends React.Component<IProps, object> {
    public render() {
        const { id, text } = this.props;
        return (
            <div id={id} className={"EmptyTaskItem"}>
                <div className="ImageStyle">
                    <img src={"/assets/EmptyTaskIcon.svg"} />
                </div>
                <div className="CaptionStyle">
                    <label className="labelNone">None</label>
                    <label className="labelText">{text}</label>
                </div>
            </div>
        )
    }
};

export default EmptyTaskItem;

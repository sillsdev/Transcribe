import * as React from 'react';
import Duration from './Duration';
import './TaskItem.css';

interface IProps {
    id: string;
    length: number;
    name: string;
    select: (id: string) => any;
    selected?: boolean;
};

class TaskItem extends React.Component<IProps, object> {
    public render() {
        const { id, length, name, select } = this.props;
        const displayName = (name != null &&  name.trim() !== ''? name.trim(): "");
        const idParts = id.split('-');
        const displayId = ((idParts.length === 4)? idParts[1] + " " + Number(idParts[2]) + ":" + Number(idParts[3].slice(0,3)) + "-" + Number(idParts[3].slice(3,6)): "")

        return (
            <div className="TaskItem">
                <div
                    className={this.props.selected? "selected":"unselected"}
                    onClick={select.bind(id)}>
                    <div className="taskItemContent">
                        <div className="firstLine">
                            <span className="displayReference">{displayId}</span>
                            <span className="totalTime"><Duration seconds ={length} /></span>
                        </div>
                        <div className="textName">{displayName}</div>
                    </div>
                </div>
            </div>
            )
    }
};

export default TaskItem;

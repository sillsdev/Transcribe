import * as React from 'react';
import { Link } from 'react-router-dom';
import Duration from './Duration';
import './TaskItem.sass';

interface IProps {
    id: string;
    length: number;
    name: string;
    select?: (id: string) => any;
    selected?: boolean;
    target?: string;
};

class TaskItem extends React.Component<IProps, object> {
    public render() {
        const { id, length, name, select, target } = this.props;
        const displayName = (name != null &&  name.trim() !== ''? name.trim(): "");
        const idParts = id.split('-');
        const displayId = ((idParts.length === 4)? idParts[1] + " " + Number(idParts[2]) + ":" + Number(idParts[3].slice(0,3)) + "-" + Number(idParts[3].slice(3,6)): "");

        const oneTask = (
            <div id={id}
                className={this.props.selected? "selected":"unselected"}
                >
                <div className="taskItemContent">
                    <div className="firstLine">
                        <span className="displayReference">{displayId}</span>
                        <span className="totalTime"><Duration seconds ={length} /></span>
                    </div>
                    <div className="textName">{displayName}</div>
                </div>
            </div>
        );

        const wrapper = (target && target !== "")? (
            <Link to={target} onClick={(select !== undefined)? select.bind(this,id):null}>
                {oneTask}
            </Link>
        ): (
            <div onClick={(select !== undefined)? select.bind(this,id):null}>
                {oneTask}
            </div>
        )

        return (
            <div className="TaskItem">
                {wrapper}
            </div>
            )
    }
};

export default TaskItem;

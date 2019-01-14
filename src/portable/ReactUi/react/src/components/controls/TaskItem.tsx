import * as React from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import Duration from './Duration';
import TaskChips from './TaskChips';
import './TaskItem.sass';

interface IProps {
    direction?: string;
    id: string;
    length: number;
    name: string;
    reference?: string;
    select?: (id: string) => any;
    selected?: boolean;
    target?: string;
    avatar?: string;
    taskChips?: string[];
};

class TaskItem extends React.Component<IProps, object> {
    public render() {
        const { avatar, direction, id, length, name, reference, select, target, taskChips } = this.props;
        const displayName = (name != null &&  name.trim() !== ''? name.trim(): "");
        let displayId = reference
        if (reference == null || reference === "") {
            const idParts = id.split('-');
            displayId = ((idParts.length === 4)? idParts[1] + " " + Number(idParts[2]) + ":" + Number(idParts[3].slice(0,3)) + "-" + Number(idParts[3].slice(3,6)): "");
        }

        const oneTask = (
            <div id={id}
                className={this.props.selected? "selected":"unselected"}
                >
                <div className="taskItemContent">
                    <div className="firstLine">
                        <span className="displayReference">{displayId}</span>
                        <span className="totalTime"><Duration seconds ={length} direction={direction} /></span>
                    </div>
                    <div className="TextLine">
                        <div className="textName">{displayName}</div>
                        <div className={"AvatarRow" + (name !== "" ? "" : " hide")}>
                            <Avatar className="OnHover"
                                name={name} key={name + "Avatar"}
                                src={avatar}
                                size={24}
                                round={true} />
                        </div>
                    </div>
                    <div className="ChipsItem">
                        <TaskChips text={taskChips !== undefined? taskChips: []}/>
                    </div>
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

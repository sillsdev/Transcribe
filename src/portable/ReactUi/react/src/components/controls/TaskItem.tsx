import * as React from 'react';
import { Button } from 'react-bootstrap'
import './TaskItem.css';

interface IProps {
    id: string;
    name: string;
    select: (id: string) => any;
    selected?: boolean;
};

class TaskItem extends React.Component<IProps, object> {
    public render() {
        const { id, name, select } = this.props;
        const displayName = name.trim() !== ''? name: id;

        return (
            <div className="TaskItem">
                <Button 
                    className={this.props.selected? "selected":""}
                    onClick={select.bind(id)}>
                    {displayName}
                </Button>
            </div>
            )
    }
};

export default TaskItem;

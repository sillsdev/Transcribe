import * as React from 'react';
import { Button } from 'react-bootstrap'
import './TaskItem.css';

interface IProps {
    id: string;
    select: (id: string) => any;
};

class TaskItem extends React.Component<IProps, object> {
    public render() {
        const { id, select } = this.props;
        return (
            <div className="TaskItem">
                <Button onClick={select.bind(id)}>{id}</Button>
            </div>
            )
    }
};

export default TaskItem;

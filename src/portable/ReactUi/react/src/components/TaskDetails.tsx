import * as React from 'react';
import './TaskDetails.sass';
import LabelUx from './ui-controls/LabelUx';

class TaskDetails extends React.Component<any, object> {
    public render(){

        const {id} = this.props.match.params
        return(
            <div><LabelUx name={id}/></div>
        )
    }
}

export default TaskDetails;

import * as React from 'react';
import './TaskDetails.sass';
import LabelUx from './ui-controls/LabelUx';

class TaskDetails extends React.Component<any, object> {
    public render(){

        return(
            <div className="TaskDetails">
                <LabelUx name={"TaskDetails"}/>
            </div>
        )
    }
}

export default TaskDetails;

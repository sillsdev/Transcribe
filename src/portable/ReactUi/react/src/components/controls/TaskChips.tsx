import * as React from 'react';
import './TaskChips.sass';

interface IProps {
    text: string[];
};

class TaskChips extends React.Component<IProps, object> {
    public render() {
        const { text } = this.props;
        const stateMapper = {
            "alltasks" :  "All Tasks",
            "complete" :  "Synced",
            "mytasks" :  "My Tasks",
            "review" :  "Transcribed",
            "transcribe" :  "In Progress",
            "upload" :  "Reviewed",
        }
        const chipsList = text.map((t: string) => (
            <div key={t} className="ChipsBorder">
                <div className="ChipsLabel">
                    <label>{stateMapper[t]}</label>
                </div>
            </div>));
        return (
            <div className="TaskChips">
                {chipsList}
            </div>

        )
    }
};

export default TaskChips;

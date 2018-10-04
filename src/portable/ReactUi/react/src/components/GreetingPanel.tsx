import * as React from 'react';
import * as actions from '../actions/audioActions';
import * as actions2 from '../actions/taskActions';
import { ITranscriberStrings } from '../model/localize';
import './GreetingPanel.sass';

interface IProps extends IStateProps, IDispatchProps {
}

class GreetingPanel extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props)
        const { projectState } = this.props;
        const { completeReview, completeTranscription, selectedTask, selectedUser } = this.props;

        if (projectState === "Transcribe") {
            completeTranscription(selectedTask, selectedUser);
        } else {
            completeReview(selectedTask, selectedUser);
        }
    }

    public render() {
        const { strings } = this.props;

        return (<div className="GreetingPanel">
            <div className="Message">
                <img src={"/assets/Smile.svg"} alt="Wow!!" width="50%" height="50%"/>
                <h1>{strings.congratulations}{"!"}<br />{strings.youhavereached} <br />{strings.inboxzero}. </h1>
                <div><h1>{strings.haveaniceday}</h1></div>
            </div>
        </div>
        )
    }
};

interface IStateProps {
    projectState: string | undefined;
    selectedTask: string;
    selectedUser: string;
    strings: ITranscriberStrings;
}

interface IDispatchProps {
    completeReview: typeof actions2.completeReview;
    completeTranscription: typeof actions2.completeTranscription;
    setSubmitted: typeof actions.setSubmitted;
}

export default GreetingPanel;

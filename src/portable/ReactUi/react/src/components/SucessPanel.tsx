import * as React from 'react';
import * as actions from '../actions/audioActions';
import * as actions2 from '../actions/taskActions';
import { ITranscriberStrings } from '../model/localize';
import NextAction from './controls/NextAction';
import './SucessPanel.sass';

interface IProps extends IStateProps, IDispatchProps {
}

class SuccessPanel extends React.Component<IProps, any> {
    constructor(props: IProps){
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
        const nextText = (this.state == null || this.state.taskState === "Transcribe")? strings.review: strings.upload;

        return (<div className="SucessPanel">
            <div className="Message">
                <h1>{strings.congratulations}</h1>
                <div className="Check"><h1>{"\u2714"}</h1></div>
            </div>
            <div className="ActionRow">
                <div className="Spacer">{"\u00A0"}</div>
                <NextAction target={this.next} text={nextText} />
            </div>
        </div>
        )
    }

    private next = () => {
        this.props.setSubmitted(false);
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

export default SuccessPanel;

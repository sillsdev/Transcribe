import * as React from 'react';
import Avatar from 'react-avatar';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Duration from '../components/controls/Duration';
import { IProjectSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize'
import NextAction from './controls/NextAction';
import './TaskDetails.sass';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';
import TextInputFieldUx from './ui-controls/TextInputFieldUx';
import TextSelectFieldUx from './ui-controls/TextSelectFieldUx';

// interface IProps extends IStateProps, IDispatchProps {
// };

class TaskDetails extends React.Component<IStateProps, object> {
    public render() {
        const { strings } = this.props;

        const deleteTask = () => { alert("Delete Task") }
        // const handleSubmit = () => {alert("Handle Submit")}
        // const wrapper = ""
        const name = "Greg Trihus"
        return (
            <div className="TaskDetails">
                <div className="closeRow">
                    <Link to="/ProjectSettings">
                        <img src="/assets/close-x.svg" alt="X" />
                    </Link>
                </div>
                <div className="titleRow">
                    <div className="title">
                        <LabelCaptionUx name={strings.taskDetails} type="H2" />
                    </div>
                    <div className="deleteButton">
                        <NextAction text={strings.delete} target={deleteTask} type="danger" />
                    </div>
                </div>
                <div className="details">
                    <div className="results">
                        <div className="resultsLeft">
                            <img src="/assets/waveform.png" />
                            <div className="taskItemContent">
                                <div className="firstLine">
                                    <span className="displayReference">Luke 1:26–38</span>
                                    <span className="totalTime"><Duration seconds={100} /></span>
                                </div>
                                <div className="textName">The Birth of John the Baptist Foretold</div>
                            </div>
                            <div className="AvatarIcon">
                                <Avatar name={name} src={"/assets/storyAvatar.png"} size={64} round={true} />
                                <br /> <br />
                                <div className="AvatarCaption">Greg Trihus</div>
                            </div>
                        </div>
                        <div className="resultsRight">
                            <div><TextInputFieldUx id="id1" captionValue="Audio File" inputValue="xyz-07292018.mp3" messageValue="" isReadOnly={true} /></div>
                            <div><TextInputFieldUx id="id2" captionValue="Reference" inputValue="Luke 1:26–38" messageValue="" isReadOnly={false} /></div>
                            <div><TextInputFieldUx id="id3" captionValue="Heading" inputValue="The Birth of John the Baptist Foretold" messageValue="" isReadOnly={true} /></div>
                            <div><TextSelectFieldUx id="id4" captionValue="Assigned To" selectOptions="The Birth of John the Baptist Foretold" messageValue="" /></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

interface IStateProps {
    strings: IProjectSettingsStrings;
};

const mapStateToProps = (state: IState): IStateProps => ({
    strings: userStrings(state, { layout: "projectSettings" }),
});

// interface IDispatchProps {
// };

// const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
//     ...bindActionCreators({
//     }, dispatch),
// });

export default connect(mapStateToProps,
    // mapDispatchToProps
)(TaskDetails);
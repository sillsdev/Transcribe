import * as React from 'react';
import AvatarEditor from 'react-avatar-editor';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/avatarActions';
import * as actions2 from '../actions/taskActions';
import { IProjectSettingsStrings, IUserSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import uiDirection from '../selectors/direction';
import userStrings from '../selectors/localize';
import './AvatarEdit.sass';
import BackLink from './controls/BackLink';
import IconButtonField from './ui-controls/IconButtonField';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';

interface IAvatarEdit extends IAvatarState {
  discard: boolean;
  fromPath: string;
  imageData: any;
  scale: number;
}

interface IProps extends IStateProps, IDispatchProps {
  history: {
    location: {
      pathname: string;
    }
  },
  size?: number,
  snapShotTest?: boolean,
}

export class AvatarEdit extends React.Component<IProps, IAvatarEdit> {
  public state: IAvatarEdit;
  public editor: React.RefObject<AvatarEditor>;

  public constructor(props: IProps) {
    super(props);
    this.state = { ...this.props.avatar,
      discard: false,
      fromPath: "User",
      imageData: this.props.avatar.data,
      scale: 1
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleNewImage = this.handleNewImage.bind(this);
    this.handleScale = this.handleScale.bind(this);
    this.discard = this.discard.bind(this);
    this.editor = React.createRef();
  }

  public render() {
    const historyPath = this.props.history.location.pathname;
    const { size = 175, strings, strings2, direction } = this.props;
    const { borderRadius, discard, imageData, scale } = this.state;
    const backTo = historyPath.slice(0, historyPath.indexOf("/avatar"))
    const save = () => this.save(this);
    if (discard) {
      return (<Redirect to={backTo} />)
    }
    const wrapper = (this.props.snapShotTest) ? "Dropzone + Avatar": (
        <AvatarEditor
          ref={this.editor}
          scale={scale}
          width={size}
          height={size}
          rotate={0}
          borderRadius={size / (100 / borderRadius)}
          image={imageData}
          onImageChange={this.handleSave}
          onImageReady={this.handleSave}
          color={[128, 128, 128, 0.6]}
        />
    );

    const settingsStyle = direction? " " + direction: "";
    return (
      <div className={"AvatarEdit" + settingsStyle}>
        <div className="panel">
          <div className="titleRow">
            <BackLink action={save} target={backTo} />
            <div className="title">
              <LabelCaptionUx name={strings.editAvatar} type="H3" />
            </div>
          </div>
          <div className="data">
            <div>
              {wrapper}
            </div>
          </div>
          <div className="options">
            <div className="uploadContent">
              <LabelCaptionUx name={strings.newImage + " : "} />
              <button className="btn">{strings.browse + "..."}</button>
              <input
                name="newImage"
                type="file"
                onChange={this.handleNewImage}
              />
            </div>
            <div className="zoomContent">
              <LabelCaptionUx name={strings.zoom + " :"} />
              <input
                name="scale"
                type="range"
                onChange={this.handleScale}
                min="1"
                max="3"
                step="0.01"
                defaultValue="1"
              />
            </div>
          </div>
          <div className="action">
            <IconButtonField
              id="discard"
              caption={strings2.discardChanges}
              imageUrl="CancelIcon.svg"
              onClick={this.discard}
            />
          </div>
        </div>
      </div>
    );
  }

  private handleSave = () => {
    if (this.editor && this.editor.current){
      const img = this.editor.current.getImageScaledToCanvas().toDataURL();
      this.setState({ data: img })
    }
  };

  private handleDrop = (acceptedFiles: any) => {
    this.setState({ imageData: acceptedFiles[0], uri: acceptedFiles[0].name });
  };

  private handleNewImage = (e: any) => {
    this.setState({ imageData: e.target.files[0], uri: e.target.files[0].name });
  };

  private handleScale = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scale = parseFloat(e.target.value);
    this.setState({ scale });
  };

  private discard() {
    this.setState({ ...this.state, discard: true })
  }

  private save(ctx: AvatarEdit) {
    const { avatar, saveAvatar, setSaveToProject, updateProjectAvatar, user } = this.props;
    const { data, saveToProject } = avatar;
    if (this.state.data !== data) {
      saveAvatar(this.state);
      if (saveToProject !== "") {
        updateProjectAvatar(user, saveToProject, {img: this.state.data});
        setSaveToProject("");
      }
    }
  }
}

interface IStateProps {
  avatar: IAvatarState;
  direction: string;
  strings: IUserSettingsStrings;
  strings2: IProjectSettingsStrings;
  user: string;
}

const mapStateToProps = (state: IState): IStateProps => ({
  avatar: state.avatar,
  direction: uiDirection(state),
  strings: userStrings(state, { layout: "userSettings" }),
  strings2: userStrings(state, { layout: "projectSettings" }),
  user: state.users.selectedUser
});

interface IDispatchProps {
  saveAvatar: typeof actions.saveAvatar;
  setSaveToProject: typeof actions.setSaveToProject;
  updateProjectAvatar: typeof actions2.updateProjectAvatar;
}

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
  ...bindActionCreators({
    saveAvatar: actions.saveAvatar,
    setSaveToProject: actions.setSaveToProject,
    updateProjectAvatar: actions2.updateProjectAvatar,
  }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AvatarEdit);

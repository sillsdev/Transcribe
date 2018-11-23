import * as React from "react";
import Avatar from "react-avatar-editor";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { bindActionCreators } from "redux";
import { log } from "../actions/logAction";
import * as actions2 from "../actions/taskActions";
import * as actions from "../actions/userActions";
import store from "../globalsStore";
import { IProjectSettingsStrings, IUserSettingsStrings } from "../model/localize";
import { IState } from "../model/state";
import uiDirection from "../selectors/direction";
import userStrings from "../selectors/localize";
import currentProject from "../selectors/project";
import "./AvatarEdit.sass";
import BackLink from "./controls/BackLink";
import IconButtonField from "./ui-controls/IconButtonField";
import LabelCaptionUx from "./ui-controls/LabelCaptionUx";

const initialState = {
  allowZoomOut: false,
  borderRadius: 0,
  discard: false,
  fromPath: "User",
  height: 350,
  image: "/assets/Smile.svg",
  preview: {
    img: "/assets/Smile.svg",
    rect: null
  },
  scale: 1,
  width: 350
};

interface IProps extends IStateProps, IDispatchProps {
  history: {
    location: {
      pathname: string;
    };
  };
}

class AvatarEdit extends React.Component<IProps, typeof initialState> {
  public state: typeof initialState;
  public editor: any;

  public constructor(props: IProps) {
    super(props);
    this.state = initialState;
    this.handleBorderRadius = this.handleBorderRadius.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleNewImage = this.handleNewImage.bind(this);
    this.handleScale = this.handleScale.bind(this);
    this.discard = this.discard.bind(this);
  }

  public setEditorRef = (editor: any) => {
    if (editor) {
      this.editor = editor;
    }
  };

  public handleBorderRadius = (e: any) => {
    const borderRadius = parseInt(e.target.value, 16);
    this.setState({ borderRadius });
  };

  public handleSave = (data: any) => {
    const img = this.editor.getImageScaledToCanvas().toDataURL();
    const rect = this.editor.getCroppingRect();

    this.setState({
      preview: {
        img,
        rect
      }
    });
  };

  public handleDrop = (acceptedFiles: any) => {
    this.setState({ image: acceptedFiles[0] });
  };

  public handleNewImage = (e: any) => {
    store.tempImageFile = e.target.files[0].name;
    this.setState({ image: e.target.files[0] });
  };

  public handleScale = (e: any) => {
    const scale = parseFloat(e.target.value);
    this.setState({ scale });
  };

  public componentWillMount() {
    const historyPath = this.props.history.location.pathname;
    const {
      tasks,
      selectedUser,
      selectedProject,
      users,
      popupUser
    } = this.props;
    let user = users.filter(u => u.username.id === selectedUser)[0];
    const project = tasks.filter(t => t.id === selectedProject)[0];
    if (historyPath.includes("PopupUser") || historyPath.includes("User")) {
      this.setState({ fromPath: "User" });
      if (historyPath.includes("PopupUser")) {
        this.setState({ fromPath: "PopupUser" });
        user = users.filter(u => u.username.id === popupUser)[0];
      }
      if (user !== undefined && user.username.avatarUri !== undefined) {
        if (this.state.image !== user.username.avatarUri) {
          this.setState({ image: user.username.avatarUri });
        }
      }
      if (this.state.borderRadius !== 100) {
        this.setState({ borderRadius: 100 });
      }
    } else if (historyPath.includes("Project")) {
      if (project !== undefined && project.uri !== undefined) {
        if (this.state.image !== project.uri) {
          this.setState({ image: project.uri });
        }

        if (this.state.borderRadius !== 0) {
          this.setState({ borderRadius: 0 });
        }
      }
    }
  }

  public render() {
    const historyPath = this.props.history.location.pathname;
    const { strings, strings2, direction } = this.props;
    const { discard } = this.state;
    const browseCaption =
      direction && direction === "rtl"
        ? "..." + strings.browse
        : strings.browse + "...";
    let backTo = "/settings";
    const save = () => this.save(this);
    log("AvatarEdit");
    if (discard) {
        return (<Redirect to="/ProjectSettings/User" />)
    }
    if (historyPath.includes("PopupUser")) {
      backTo = "/ProjectSettings/User";
    } else if (historyPath.includes("Project")) {
      backTo = "/main";
    }

    return (
      <div className="AvatarEdit">
        <div className="panel">
          <div className="titleRow">
            <BackLink action={save} target={backTo} />
            <div className="title">
              <LabelCaptionUx name={"Edit Avatar"} type="H2" />
            </div>
          </div>
          <div className="data">
            <div>
              <Dropzone
                onDrop={this.handleDrop}
                disableClick={true}
                multiple={false}
                style={{ width: 350, height: 350 }}
              >
                <Avatar
                  ref={this.setEditorRef}
                  scale={this.state.scale}
                  width={350}
                  height={350}
                  rotate={0}
                  borderRadius={350 / (100 / this.state.borderRadius)}
                  image={this.state.image}
                  className="editor-canvas"
                  onImageChange={this.handleSave}
                  onImageReady={this.handleSave}
                  color={[128, 128, 128, 0.6]}
                />
              </Dropzone>
            </div>
          </div>
          <div className="options">
            <div className="uploadContent">
              <LabelCaptionUx name={strings.newImage + " : "} />
              <button className="btn">{browseCaption}</button>
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
                max="2"
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

  private discard() {
    this.setState({ ...this.state, discard: true })
  }

  private save(ctx: AvatarEdit) {
    const historyPath = this.props.history.location.pathname;
    const {
      selectedUser,
      selectedProject,
      popupUser,
      updateAvatar,
      updateProjectAvatar
    } = this.props;
    let currUser = selectedUser;
    if (historyPath.includes("PopupUser")) {
      currUser = popupUser;
      updateAvatar(currUser, selectedProject, this.state);
    } else if (historyPath.includes("Project")) {
      updateProjectAvatar(selectedUser, selectedProject, this.state);
    } else {
      updateAvatar(currUser, selectedProject, this.state);
    }
  }
}

interface IStateProps {
  direction: string;
  tasks: IProject[];
  selectedUser: string;
  selectedProject: string;
  popupUser: string;
  strings: IUserSettingsStrings;
  strings2: IProjectSettingsStrings;
  users: IUser[];
  project: IProject;
}

const mapStateToProps = (state: IState): IStateProps => ({
  direction: uiDirection(state),
  popupUser: state.users.selectedPopupUser,
  project: currentProject(state),
  selectedProject: state.tasks.selectedProject,
  selectedUser: state.users.selectedUser,
  strings: userStrings(state, { layout: "userSettings" }),
  strings2: userStrings(state, { layout: "projectSettings" }),
  tasks: state.tasks.projects,
  users: state.users.users
});

interface IDispatchProps {
  updateAvatar: typeof actions.updateAvatar;
  selectPopupUser: typeof actions.selectPopupUser;
  updateProjectAvatar: typeof actions2.updateProjectAvatar;
}

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
  ...bindActionCreators(
    {
      selectPopupUser: actions.selectPopupUser,
      updateAvatar: actions.updateAvatar,
      updateProjectAvatar: actions2.updateProjectAvatar
    },
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AvatarEdit);

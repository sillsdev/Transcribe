import * as React from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { IProjectSettingsStrings } from '../../model/localize';
import { IState } from '../../model/state';
import userStrings from '../../selectors/localize';
import './Project.sass';

interface IProps extends IStateProps{
    id: string;
    isAdmin: boolean;
    name: string;
    select?: (id: string) => any;
    target: string;
    uri: string;
    newProject?: () => any;
    changeImage?: () => any;
}

const initialState = {
    projectTop: 0
}

class Project extends React.Component<IProps, typeof initialState> {
    public state = {...initialState};
    private projectRef: React.RefObject<HTMLDivElement>;

    public constructor(props: IProps){
        super(props);
        this.projectRef = React.createRef();
    }

    public componentDidMount() {
        this.setState({projectTop: this.projectRef && this.projectRef.current && this.projectRef.current.offsetTop? this.projectRef.current.offsetTop: 0})
    }

    public render() {
        const { changeImage, id, isAdmin, name, newProject, select, strings, target, uri } = this.props;
        let linkClassName;
        let adminWrapper;
        if(isAdmin){
            adminWrapper = (
                <div className="adminDiv">
                    <ContextMenuTrigger id="Skewer">
                        <div className="ContextMenu"><img src="/assets/skewer.svg" /></div>
                    </ContextMenuTrigger>
                    <img src={"/assets/adminIcon.svg"} alt="admin" className="adminIcon"/>
                    <div className="adminCaption">{strings.admin.toUpperCase()}</div>
                    <ContextMenu id={"Skewer"}>
                        <MenuItem onClick={newProject}>
                            {strings.makeProject}
                        </MenuItem>
                        <MenuItem onClick={changeImage}>
                            {strings.changeImage}
                        </MenuItem>
                    </ContextMenu>
                </div>
            );
            linkClassName = "main";
        }
        else{
            adminWrapper = (<div />);
            linkClassName = "mainNotAdmin";
        }
        const imgWrapper = (uri != null && uri !== "")? 
            <img src={uri} className="projectImage" />: ""
        return(
            <div id={id} className="Project" ref={this.projectRef}>
                <Link to={target} onClick={select && select.bind(this, id)} className={linkClassName}>
                    {imgWrapper}
                    <div className="captionDiv" style={{top: this.state.projectTop}}><span className="caption">{name}</span></div>
                    {adminWrapper}
                </Link>
            </div>
        )
    }
};

interface IStateProps {
    strings: IProjectSettingsStrings;
};

const mapStateToProps = (state: IState): IStateProps => ({
    strings: userStrings(state, {layout: "projectSettings"}),
});

export default connect(mapStateToProps)(Project);
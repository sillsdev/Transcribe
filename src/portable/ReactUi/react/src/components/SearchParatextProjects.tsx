import * as React from 'react';
import { IoIosRefresh } from 'react-icons/io';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { log } from '../actions/logAction';
import * as actions from '../actions/paratextProjectActions';
import * as actions1 from '../actions/taskActions';
import { IProjectSettingsStrings } from '../model/localize';
import { IState } from '../model/state';
import userStrings from '../selectors/localize';
import ButtonLink from './controls/ButtonLink';
import NextAction from './controls/NextAction';
import './SearchParatextProjects.sass';
import AnchorHelp from './ui-controls/AnchorHelp';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';


interface IProps extends IStateProps, IDispatchProps {
};


class SearchParatextProjects extends React.Component<IProps, object> {
    public componentDidMount() {
        const { fetchParatextProjects } = this.props;
        fetchParatextProjects();
    }

    public selectEmptyProject = () => {
        const {zttProjectsCount} = this.props;
        if(zttProjectsCount.toString() === "0"){
            this.selectProject({id:"ztt", guid:"", lang:"und"})
        }
        else{
            this.selectProject({id:"ztt" + zttProjectsCount, guid:"", lang:"und"})
        }
    }

    public render() {
        const { selectedParatextProject, strings } = this.props;

        log("SearchParatextProjects")
        let wrapper;
        if(!this.props.loaded)
        {
            wrapper=(
                <div className="list">
                    <LabelCaptionUx name={strings.lookingForProjects} />
                    <span className="loadIconStyle">
                        <IoIosRefresh fontSize="60px" color="#347eff" />
                    </span>
                    <div className="ButtonLink">
                        <ButtonLink text={strings.next.toUpperCase()} target="/NewOrBrowseParatextProjects" type="outline-light" />
                    </div>
                </div>)
        }
        const { loaded, paratextProjects } = this.props;        
        if (loaded) {
            if (paratextProjects.length === 0) {
                wrapper=(<Redirect to="/NewOrBrowseParatextProjects"/>)
            } else if (selectedParatextProject !== "") {
                wrapper=(<Redirect to="/ProjectSettings"/>)
            } else {
                const projects = paratextProjects.map((paratextProject:IParatextProject) =>
                    <li className="list-item" key={paratextProject.id}
                        onClick={this.selectProject.bind(this, paratextProject)}>
                        <div className="name">{paratextProject.name != null? paratextProject.name: paratextProject.id}</div>
                        <div className="code">{paratextProject.langName != null? paratextProject.langName: paratextProject.lang}</div>
                    </li>);
                wrapper = (
                    <div className="list">
                        <div id="ParatextProject" className="label">{strings.selectProject}</div>
                        <ul>
                            {projects}
                        </ul>
                        <div className="ButtonLink">
                            <NextAction text={strings.skip} target={this.selectEmptyProject} type="outline-light" />
                        </div>
                    </div>)
            }
        }
        
        return(
            <div className="SearchParatextProjects">
                <div className="anchorHelp">
                    <AnchorHelp id="UiLangHelp" onClick={this.ShowHelp} />
                </div>
                {wrapper}
            </div>                
                          
        );
    }

    private selectProject(project: IParatextProject){
        this.props.selectParatextProject(project);
    }

    private ShowHelp = () => {
        this.props.showHelp("User_Interface/Select_a_Paratext_Project_window.htm")
    }
}

interface IStateProps {
    loaded: boolean;
    paratextProjects: IParatextProject[];
    selectedParatextProject: string;
    strings: IProjectSettingsStrings;
    zttProjectsCount: string;
  };

  const mapStateToProps = (state: IState): IStateProps => ({
    loaded: state.paratextProjects.loaded,
    paratextProjects: state.paratextProjects.paratextProjects,
    selectedParatextProject: state.paratextProjects.selectedParatextProject,
    strings: userStrings(state, { layout: "projectSettings" }),
    zttProjectsCount: state.tasks.zttProjectsCount,
  });

  interface IDispatchProps {
    fetchParatextProjects: typeof actions.fetchParatextProjects,
    selectParatextProject: typeof actions.selectParatextProject;
    showHelp: typeof actions1.showHelp;
  };

  const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({        
        fetchParatextProjects: actions.fetchParatextProjects,
        selectParatextProject: actions.selectParatextProject,
        showHelp: actions1.showHelp,
        }, dispatch),
  });

export default connect(mapStateToProps, mapDispatchToProps)(SearchParatextProjects);
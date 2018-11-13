import * as React from 'react';
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
    size?: string;
    target: string;
    uri: string;
}

class Project extends React.Component<IProps, object> {
    public render() {
        const { id, isAdmin, select=(() => undefined), target, uri, strings } = this.props;
        let linkClassName;
        let adminWrapper;
        if(isAdmin){
            adminWrapper = (<div className="adminDiv">
            <img src={"/assets/adminIcon.svg"} alt="admin" className="adminIcon"/>
            <div className="adminCaption">{strings.admin.toUpperCase()}</div>
        </div>);
            linkClassName = "main";
        }
        else{
            adminWrapper = (<div />);
            linkClassName = "mainNotAdmin";
        }
        return(
        <div id={id} className="Project">
            <Link to={target} onClick={select.bind(this, id)} className={linkClassName}>
                <img src={uri} alt={id} className="projectImage" />
                <div className="caption">{id}</div>
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
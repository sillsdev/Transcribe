import * as React from 'react';
import Avatar from 'react-avatar';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { IProjectSettingsStrings } from '../../model/localize';
import { IState } from '../../model/state';
import userStrings from '../../selectors/localize';
import './User.sass';

interface IProps extends IStateProps {
    id: string;
    name: string;
    select?: (id: string) => any;
    size?: string;
    target: string;
    uri: string;
    role: string[];
};

export class User extends React.Component<IProps, object> {
    public render() {
        const { id, name, select=(() => undefined), size="64", target, uri, role, strings } = this.props;
        let workingAs
        if (role && role.indexOf("administrator") >= 0) {
            workingAs = strings.admin
        } else if (role.indexOf("reviewer") >= 0) {
            workingAs = strings.reviewer
        } else {
            workingAs = strings.transcriber
        }
        return (
                <Link id={id} to={target} onClick={select.bind(this, id)} className="User">
                    <div className="main">
                        <Avatar name={name} src={uri} size={size} round={true}/>
                        <br /> <br />
                        <div className="caption">{name}</div>
                        <div className="role">{workingAs}</div>
                    </div>
                </Link>
        )
    }
};

interface IStateProps {
    strings: IProjectSettingsStrings;
};

const mapStateToProps = (state: IState): IStateProps => ({
    strings: userStrings(state, {layout: "projectSettings"}),
});

export default connect(mapStateToProps)(User);

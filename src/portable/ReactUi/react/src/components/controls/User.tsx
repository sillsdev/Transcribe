import * as React from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import './User.sass';

interface IProps {
    id: string;
    name: string;
    select?: (id: string) => any;
    size?: string;
    target: string;
    uri: string;
    role: string[];
};

class User extends React.Component<IProps, object> {
    public render() {
        const { id, name, select=(() => undefined), size="64", target, uri, role } = this.props;
        return (
                <Link id={id} to={target} onClick={select.bind(this, id)} className="User">
                    <div className="main">
                        <Avatar name={name} src={uri} size={size} round={true}/>
                        <br /> <br />
                        <div className="caption">{name}</div>
                        <div className="role">working as {role.join(' + ')}</div>
                    </div>
                </Link>
        )
    }
};

export default User;

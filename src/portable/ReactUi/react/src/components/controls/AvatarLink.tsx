import * as React from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import './AvatarLink.sass';

interface IProps {
    id: string;
    name: string;
    select?: (id: string) => any;
    size?: string;
    target: string;
    uri: string;
    avatarShape?: boolean
};

class AvatarLink extends React.Component<IProps, object> {
    public render() {
        const { avatarShape, id, name, select=(() => undefined), size="64", target, uri } = this.props;
        return (
            <div id={id} className="AvatarLink">
                <Link to={target} onClick={select.bind(this, id)}>
                    <Avatar className="OnHover"  name={name} src={uri} size={size} round={(avatarShape !== undefined && !avatarShape)? avatarShape: true}/>
                    <br /> <br />
                    <div className="caption">{name}</div>
                </Link>
            </div>
        )
    }
};

export default AvatarLink;

import * as React from 'react';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import './AvatarLink.css';

interface IProps {
    id: string;
    name: string;
    size?: string;
    target: string;
    uri: string;
    select: (id: string) => any;
};

class AvatarLink extends React.Component<IProps, object> {
    public render() {
        const { id, name, size="64", target, uri, select } = this.props;
        return (
            <div className="AvatarLink">
                <Link to={target} onClick={select.bind(this, id)}>
                <Avatar name={name} src={uri} size={size} round={true}/>
                <br /> <br />
                <div className="caption">{name}</div>
                </Link>
            </div>
            )
    }
};

export default AvatarLink;

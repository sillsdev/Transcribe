import * as React from 'react';
import { Link } from 'react-router-dom';
import './PlayPause.css';

interface IProps {
    target: string;
};

class PlayPause extends React.Component<IProps, object> {
    public render() {
        const { target } = this.props;
        return (
            <div className="PlayPause">
                <Link to={target}>
                    {/* {"\u2039"} */}
                    {/* {"\u2329"} */}
                    {"\u25B6"}
                </Link>
            </div>
            )
    }
};

export default PlayPause;

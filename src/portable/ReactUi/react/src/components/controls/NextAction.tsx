import * as React from 'react';
import { Button } from 'react-bootstrap'
import './NextAction.css';

interface IProps {
    target: string;
};

class NextAction extends React.Component<IProps, object> {
    public render() {
        const { target } = this.props;
        return (
            <div className="NextAction">
                <Button to={target}>
                    {/* {"\u2039"} */}
                    {/* {"\u2329"} */}
                    {"\u2022 \u2022 \u2022"}
                </Button>
            </div>
            )
    }
};

export default NextAction;

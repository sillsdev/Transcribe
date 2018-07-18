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
                <Button
                    onClick={target}
                    bsStyle="primary"
                    bsSize="small">
                    {"Submit"}
                </Button>
            </div>
        )
    }
};

export default NextAction;

import * as React from 'react';
import { Button } from 'react-bootstrap'
import './NextAction.css';

interface IProps {
    target: string;
    text: string;
};

class NextAction extends React.Component<IProps, object> {
    public render() {
        const { target, text } = this.props;
        return (
            <div className="NextAction">
                <Button
                    onClick={target}
                    bsStyle="primary"
                    bsSize="small">
                    {text}
                </Button>
            </div>
        )
    }
};

export default NextAction;

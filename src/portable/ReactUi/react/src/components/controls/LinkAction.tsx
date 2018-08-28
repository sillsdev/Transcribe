import * as React from 'react';
import { Button } from 'react-bootstrap'
import './LinkAction.sass';

interface IProps {
    target:  (context: React.Component) => any;
    text: string;
};

class LinkAction extends React.Component<IProps, object> {
    // public linkClick() {
    //     // tslint:disable-next-line:no-console
    //     console.log("Save button clicked!!");
    // }
    public render() {
        const { target, text } = this.props;
        return (
            <div id="LinkAction" className="LinkAction">
                <Button
                    onClick={target}
                    bsStyle="link"
                    bsSize="small">
                    {text}
                </Button>
            </div>
        )
    }
};

export default LinkAction;

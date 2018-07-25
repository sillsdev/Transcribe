import * as React from 'react';
import { Button } from 'react-bootstrap'
import './LinkAction.css';

interface IProps {
    target: string;
};

class LinkAction extends React.Component<IProps, object> {
    public linkClick() {
        // tslint:disable-next-line:no-console
        console.log("Save button clicked!!");
    }
    public render() {
        // const { target } = this.props;
        return (
            <div className="LinkAction">
                <Button
                    onClick={this.linkClick}
                    bsStyle="link"
                    bsSize="small">
                    {"Reset to defaults"}
                </Button>
            </div>
        )
    }
};

export default LinkAction;

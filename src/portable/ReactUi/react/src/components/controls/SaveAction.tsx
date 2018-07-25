import * as React from 'react';
import { Button } from 'react-bootstrap'
import './SaveAction.css';

interface IProps {
    target: string;
};

class SaveAction extends React.Component<IProps, object> {

    public saveClick() {
        // tslint:disable-next-line:no-console
        console.log("Save button clicked!!");
    }

    public render() {
        // const { target } = this.props;
        return (
            <div className="SaveAction">
                <Button
                    onClick={this.saveClick}
                    bsStyle="primary"
                    bsSize="small">
                    {"Save"}
                </Button>
            </div>
        )
    }
};

export default SaveAction;

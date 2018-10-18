import * as React from 'react';
import { Button } from 'react-bootstrap'
import './FilterAction.sass';

interface IProps {
    target:  (context: React.Component) => any;
    text: string;
};

class FilterAction extends React.Component<IProps, object> {
    public render() {
        const { target, text } = this.props;
        return (
            <div id="FilterAction" className="FilterAction">
                <Button
                    onClick={target}
                    bsStyle="link"
                    bsSize="small">
                    {text}
                    {"\u2003"}
                    <img src={"/assets/Filter.svg"} alt="Filter" />
                </Button>
            </div>
        )
    }
};

export default FilterAction;

import * as React from 'react';
import { Label } from 'react-bootstrap';
import './LabelCaptionUx.css';

interface IProps {
    name: string
}
class LabelCaptionUx extends React.Component<IProps, any> {
    public render() {
        return (
            <div>
                <Label bsClass="LabelCaptionUx">{this.props.name}</Label>
            </div>
        )
    }
};

export default LabelCaptionUx;
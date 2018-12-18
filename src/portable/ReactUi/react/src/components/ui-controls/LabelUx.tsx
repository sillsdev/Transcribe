import * as React from 'react';
import { Label } from 'react-bootstrap';
import './LabelUx.sass';

interface IProps {
    name: string
}

class LabelUx extends React.Component<IProps, any> {
    public render() {
        return (
            <Label className="LabelUx">{this.props.name}</Label>
        )
    }
};

export default LabelUx;

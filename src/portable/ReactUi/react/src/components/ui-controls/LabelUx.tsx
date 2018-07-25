import * as React from 'react';
import { Label } from 'react-bootstrap';
import './LabelUx.css';

interface IProps {
    name: string
}

class LabelUx extends React.Component<IProps, any> {
    public render() {
        return (
            <Label bsClass="LabelUx">{this.props.name}</Label>
        )
    }
};

export default LabelUx;

import * as React from 'react';
import { Label } from 'react-bootstrap';
import './LabelCaptionUx.sass';

interface IProps {
    name: string,
    type?: string,
}
class LabelCaptionUx extends React.Component<IProps, any> {
    public render() {
        const { type } = this.props;
        const style = "LabelCaptionUx " + ((type !== undefined)? type: "");
        return (
            <Label bsClass={style}>{this.props.name}</Label>
        )
    }
};

export default LabelCaptionUx;
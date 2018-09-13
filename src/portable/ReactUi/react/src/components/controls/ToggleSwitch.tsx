import * as React from 'react';
import { Label } from 'react-bootstrap';
import Switch from 'react-toggle-switch'
import './ToggleSwitch.sass';

interface IProps {
    switched: boolean,
    text: string,
    type: string,
}

class ToggleSwitch extends React.Component<IProps, any> {
    public state = {
        switched: true,
    }

    constructor(props: IProps) {
        super(props);
        this.state = {
            switched: true,
        };
        this.handleChange = this.handleChange.bind(this);
    }



    public toggleSwitch = () => {
        this.setState((prevState: any) => {
            return {
                switched: !prevState.switched,
            };
        });
    };

    public handleChange(event: any) {
       // tslint:disable-next-line:no-console
       console.log(this.state.switched)
    }

    public render() {
        const { type, text } = this.props
        const style = "ToggleSwitch " + type
        const lableStyle = (this.state.switched)? "SwitchLabel SwitchLabelOn":"SwitchLabel SwitchLabelOff"
        return (
            <div className={style}>
                <Switch onClick={this.toggleSwitch} on={this.state.switched} />
                <Label bsClass={lableStyle}>{text}</Label>
            </div>
        )
    }
};

export default ToggleSwitch;

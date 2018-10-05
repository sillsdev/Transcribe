import * as React from 'react';
import { Label } from 'react-bootstrap';
import Switch from 'react-toggle-switch'
import './ToggleSwitch.sass';

interface IProps {
    enabled?: boolean;
    onChange?: (value: boolean) => any;
    switched?: boolean;
    text: string;
    type?: string;
};

const initialState = {
    switched: true,
};

class ToggleSwitch extends React.Component<IProps, typeof initialState> {
    public state = {...initialState};

    constructor(props: IProps) {
        super(props);
        if (this.props.switched !== undefined){
            this.state = {switched: this.props.switched};
        }
        this.handleChange = this.handleChange.bind(this);
    }

    public toggleSwitch = () => {
        this.setState({ switched: !this.state.switched });
    };

    public handleChange(event: any) {
       // tslint:disable-next-line:no-console
       console.log(this.state.switched)
       if (this.props.onChange) {
           this.props.onChange(this.state.switched);
       }
    }

    public render() {
        const { enabled, type, text } = this.props
        const style = "ToggleSwitch " + type
        const lableStyle = (enabled !== undefined && !enabled)? "SwitchLabel SwitchLabelDisabled": "SwitchLabel SwitchLabelOn";
        return (
            <div className={style}>
                <Switch
                    onClick={this.toggleSwitch}
                    on={this.state.switched && (enabled === undefined || enabled)}
                    enabled={enabled === undefined || enabled} />
                <Label bsClass={lableStyle}>{text}</Label>
            </div>
        )
    }
};

export default ToggleSwitch;

import * as React from 'react';
import './TextboxUx.css';

interface IProps {
    inputValue: string,
    isReadOnly: boolean
}

class TextBoxUx extends React.Component<IProps, any> {
    public state = {
        message: this.props.inputValue
    }

    constructor(props: IProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public handleChange(event: any) {
        this.setState({ message: event.target.value });
    }

    public render() {

        const { message } = this.state;
        return (
            <input readOnly={this.props.isReadOnly} className="TextBoxUx" type="text" value={message} onChange={this.handleChange} />
        )
    }
};

export default TextBoxUx;

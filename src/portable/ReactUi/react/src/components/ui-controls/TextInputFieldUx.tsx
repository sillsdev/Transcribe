import * as React from 'react';
import './TextInputFieldUx.sass';

interface IProps {
    id: string,
    captionValue: string,
    inputValue: string,
    messageValue: string,
    isReadOnly: boolean,
}

class TextInputFieldUx extends React.Component<IProps, any> {
    public state = {
        message: this.props.inputValue,
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
        const { isReadOnly } = this.props;
        const messageStyle = (this.props.messageValue.length > 0)? "Message Show CaptionRed": "Message Hide CaptionGrey";
        const bodyStyle = (this.props.messageValue.length > 0)? "Body BorderBottomRed": "Body BorderBottomGreen";
        const captionStyle = (this.props.messageValue.length > 0)? "Caption CaptionRed": "Caption CaptionGreen";

        return (
            <div>
                <div className="TextInputFieldUx">
                    <div className={captionStyle}>
                        <label >{this.props.captionValue}</label>
                    </div>
                    <div className={bodyStyle}>
                        <span>
                            <input
                            readOnly={isReadOnly}
                            className={this.props.messageValue.length > 0? "Error": "Pass"}
                            type="text"
                            value={message}
                            onChange={this.handleChange}/>
                        </span>
                        <span>
                            <img src="/assets/Clear.svg" alt="X" />
                        </span>
                    </div>
                    <div className={messageStyle}>
                        <label>{this.props.messageValue}</label>
                    </div>
                </div>
            </div>
        )
    }
}

export default TextInputFieldUx;
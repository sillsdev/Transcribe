import * as React from 'react';
import './TextSelectFieldUx.sass';

interface IProps {
    id: string,
    captionValue: string,
    selectOptions: string,
    messageValue: string,
}

class TextSelectFieldUx extends React.Component<IProps, any> {
    public state = {
        message: this.props.selectOptions,
    }

    constructor(props: IProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public handleChange(event: any) {
        this.setState({ message: event.target.value });
    }
    public render() {
        const messageStyle = (this.props.messageValue.length > 0) ? "Message Show CaptionRed" : "Message Hide CaptionGrey";
        const bodyStyle = (this.props.messageValue.length > 0) ? "Body BorderBottomRed" : "Body BorderBottomGreen";
        const captionStyle = (this.props.messageValue.length > 0) ? "Caption CaptionRed" : "Caption CaptionGreen";
        // const optionsList = ["Greg Trihus", "Paul Nelson", "Karthikeyan V", "Manjula T"];
        /* const userList = optionsList.map((user: string) =>
            <option key={user}>{user}</option>
        ); */

        return (
            <div>
                <div className="TextSelectFieldUx">
                    <div className={captionStyle}>
                        <label >{this.props.captionValue}</label>
                    </div>
                    <div className={bodyStyle}>
                        <span>
                            <select>
                                <option>Greg Trihus</option>
                                <option>Paul Nelson</option>
                                <option>Karthikeyan V</option>
                                <option>Manjula T</option>
                            </select>
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

export default TextSelectFieldUx;
import * as React from 'react';
import './SelectField.sass';

interface IProps {
    id?: string;
    caption: string;
    options: string[];
    selected?: string;
    message?: string;
}

class TextSelectFieldUx extends React.Component<IProps, any> {
    public state = {
        current: this.props.selected,
    }

    constructor(props: IProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public handleChange(event: any) {
        this.setState({ current: event.target.value });
    }

    public render() {
        const { current } = this.state;
        const { caption, id, message, options } = this.props;
        const errorMessage = (current && current !== "" && message != null)? message: "";
        const messageStyle = (errorMessage.length > 0) ? "Message CaptionRed BorderTopRed" : "Message BorderTopGreen";
        const captionStyle = (errorMessage.length > 0) ? "Caption CaptionRed" : "Caption CaptionGreen";
        const dataStyle = (current && current !== "" && current !== caption)? "DataColor": "CaptionGrey";
        const optionsList = [caption].concat(options) ;
        const userList = optionsList.map((user: string) =>
            <option key={user}>{user}</option>
        );
        const captionText = (current && current !== "" && current !== caption)? caption: "";

        return (
            <div id={id} className="TextSelectFieldUx">
                <div className="bodyRow">
                    <div className="dataColumn">
                        <label  className={captionStyle}>{captionText}</label>
                        <select className={"Body " + dataStyle}
                            onChange={this.handleChange}
                            defaultValue={current}>
                                {userList}
                        </select>
                    </div>
                </div>
                <div className={messageStyle}>
                    <label>{message}</label>
                </div>
            </div>
        )
    }
}

export default TextSelectFieldUx;
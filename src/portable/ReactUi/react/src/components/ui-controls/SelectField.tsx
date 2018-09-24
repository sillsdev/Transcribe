import * as React from 'react';
import './SelectField.sass';

interface IProps {
    id?: string;
    caption: string;
    options: any;
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
        // this.setState({ current: event.target.value });
        const { options, } = this.props;
        const selectOption = options.filter((u: IUser) => u.displayName === event.target.value);
        alert(selectOption[0].username.id);
        this.setState({ current: selectOption[0].username.id });
    }

    public render() {
        const { current } = this.state;
        const { caption, id, message, options } = this.props;
        const errorMessage = (current && current !== "" && message != null)? message: "";
        const messageStyle = (errorMessage.length > 0) ? "Message CaptionRed BorderTopRed" : "Message BorderTopGreen";
        const captionStyle = (errorMessage.length > 0) ? "Caption CaptionRed" : "Caption CaptionGreen";
        const dataStyle = (current && current !== "" && current !== caption)? "DataColor": "CaptionGrey";

        const userList = options.map((user: IUser) =>
        <option key={user.username.id} value={user.username.id}>{user.displayName}</option>
        )
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
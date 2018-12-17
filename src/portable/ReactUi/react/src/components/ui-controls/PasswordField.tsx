import * as React from 'react';
import './PasswordField.sass';

interface IProps {
    id?: string,
    caption: string,
    inputValue?: string,
    message?: string,
    show?: boolean,
    isReadOnly?: boolean,
    onChange?: (value: string) => any;
    setAdminPassword?: (password: string) => any;
}

export class PasswordField extends React.Component<IProps, any> {
    public state = {
        current: this.props.inputValue,
    }

    constructor(props: IProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleTick = this.handleTick.bind(this);
    }

    public handleTick(event: any) {
        // tslint:disable-next-line:no-console
        console.log("Tick is clicked!!");
    }

    public handleChange(event: any) {
        this.setState({current: event.target.value });
        if (this.props.setAdminPassword !== undefined){
            this.props.setAdminPassword(event.target.value);
        }
    }

    public handleClear(event: any) {
        if (!this.props.isReadOnly) {
            this.setState({current: "" })
            if (this.props.setAdminPassword !== undefined){
                this.props.setAdminPassword("");
            }
        }
    }

    public render() {
        const { current } = this.state;
        const { caption, id, isReadOnly, message, show } = this.props;
        const errorMessage = current !== "" && message? message: "";
        const messageStyle = (errorMessage.length > 0)? "Message CaptionRed BorderTopRed": "Message BorderTopGreen";
        const captionStyle = (errorMessage.length > 0)? "Caption CaptionRed": "Caption CaptionGreen";
        const clearStyle = isReadOnly || current === ""? "Hide": "clearButton";
        const tickStyle = show ? "tickButton": "tickButton Hide";
        return (
            <div id={id} className="PasswordField">
                <div className="bodyRow">
                    <div className="dataColumn">
                        <label  className={captionStyle}>{current && current !== ""? caption: ""}</label>
                        <input
                            readOnly={isReadOnly}
                            className="DataColor"
                            type="password"
                            maxLength={12}
                            minLength={6}
                            value={current}
                            placeholder={caption}
                            onChange={this.handleChange}/>
                    </div>
                    <div className={tickStyle} onClick={this.handleTick}>
                        <img src="/assets/Tick.svg" alt="E" />
                    </div>
                    <div className={clearStyle} onClick={this.handleClear}>
                        <img src="/assets/Clear.svg" alt="X" />
                    </div>
                </div>
                <div className={messageStyle}>
                    <label>{errorMessage}</label>
                </div>
            </div>
        )
    }
}

export default (PasswordField);
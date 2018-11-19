import * as React from 'react';
import './TextField.sass';

interface IProps {
    id?: string,
    caption: string,
    inputValue?: string,
    message?: string,
    autofocus?: boolean
    isReadOnly?: boolean,
    onChange?: (value: string) => any;
    onBlur?: (value: string) => any;
}

class TextInputFieldUx extends React.Component<IProps, any> {
    public state = {
        current: this.props.inputValue,
    }

    constructor(props: IProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    public handleBlur(event: any) {
        this.setState({current: event.target.value });
        if (this.props.onBlur != null) {
            this.props.onBlur(event.target.value)
        }
    }

    public handleChange(event: any) {
        this.setState({current: event.target.value });
        if (this.props.onChange != null) {
            this.props.onChange(event.target.value)
        }
    }

    public handleClear(event: any) {
        if (!this.props.isReadOnly) {
            this.setState({current: "" })
        }
        if (this.props.onChange != null) {
            this.props.onChange("")
        }
    }

    public  movePositionAtEnd(e: any) {
        const tempValue = e.target.value
        e.target.value = ''
        e.target.value = tempValue
    }

    public render() {
        const { current } = this.state;
        const { autofocus, caption, id, isReadOnly, message } = this.props;
        const errorMessage = current !== "" && message? message: "";
        const messageStyle = (errorMessage.length > 0)? "Message CaptionRed BorderTopRed": "Message BorderTopGreen";
        const captionStyle = (errorMessage.length > 0)? "Caption CaptionRed": "Caption CaptionGreen";
        const clearStyle = isReadOnly || current === ""? "Hide": "clearButton";

        return (
            <div id={id} className="TextField">
                <div className="bodyRow">
                    <div className="dataColumn">
                        <label  className={captionStyle}>{current && current !== ""? caption: ""}</label>
                        <input
                            readOnly={isReadOnly}
                            className="DataColor"
                            type="text"
                            value={current}
                            placeholder={caption}
                            onChange={this.handleChange}
                            autoFocus={autofocus}
                            onFocus={this.movePositionAtEnd}
                            onBlur={this.handleBlur}/>
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

export default TextInputFieldUx;
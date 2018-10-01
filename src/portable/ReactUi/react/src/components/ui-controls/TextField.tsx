import * as React from 'react';
import './TextField.sass';

interface IProps {
    id?: string,
    caption: string,
    inputValue?: string,
    message?: string,
    isReadOnly?: boolean,
    onChange?: (value: string) => any;
}

class TextInputFieldUx extends React.Component<IProps, any> {
    public state = {
        current: this.props.inputValue,
    }

    constructor(props: IProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClear = this.handleClear.bind(this);
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
    }

    public render() {
        const { current } = this.state;
        const { caption, id, isReadOnly, message } = this.props;
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
                            onChange={this.handleChange}/>
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
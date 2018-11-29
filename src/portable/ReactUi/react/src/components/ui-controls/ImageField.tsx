import * as React from 'react';
import { Link } from 'react-router-dom';
import './ImageField.sass';

interface IProps {
    id?: string;
    caption: string;
    fromPath: string;
    inputValue?: string;
    extensions?: string;
    message?: string;
    isReadOnly?: boolean;
    onChange?: (value: string) => any;
}

export class ImageField extends React.Component<IProps, any> {
    public state = {
        current: this.props.inputValue,
        data: "",
        file: "",
    }

    constructor(props: IProps) {
        super(props);
        this.handleClear = this.handleClear.bind(this);
    }

    public render() {
        const { current } = this.state;
        const { caption, fromPath, id, isReadOnly, message } = this.props;
        const errorMessage = current !== "" && message ? message : "";
        const messageStyle = (errorMessage.length > 0) ? "Message CaptionRed BorderTopRed" : "Message BorderTopGreen";
        const captionStyle = (errorMessage.length > 0) ? "Caption CaptionRed" : "Caption CaptionGreen";
        const clearStyle = isReadOnly || current === "" ? "Hide" : "clearButton";
        const labelContent = (current && current !== "") ? current : caption
        const labelStyle = (current && current !== "") ? "DataColor" : "CaptionGrey"
        return (
            <div id={id} className="ImageField">
                <div className="bodyRow">
                    <div className="dataColumn">
                        <label
                            className={captionStyle}>
                            {current && current !== "" ? caption : ""
                            }</label>
                        <label
                            className={"fileInput " + labelStyle}
                            key={labelContent}
                            data-content={labelContent}
                            htmlFor="Upload" />
                      
                    </div>
                    <div className={clearStyle} onClick={this.handleClear}>
                        <img src="/assets/Clear.svg" alt="X" />
                        <Link className="pencil" to={fromPath + "/avatar/PopupUser"}>{"\u2710"}</Link>
                    </div>
                </div>
                <div className={messageStyle}>
                    <label>{errorMessage}</label>
                </div>
            </div>
        )
    }

    private handleClear(event: any) {
        if (!this.props.isReadOnly) {
            this.setState({ current: "" })
        }
        if (this.props.onChange != null) {
            this.props.onChange("")
        }
    }
}

export default ImageField;
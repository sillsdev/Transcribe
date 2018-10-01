import * as React from 'react';
import './FileField.sass';

interface IProps {
    id?: string;
    caption: string;
    inputValue?: string;
    extensions?: string;
    message?: string;
    isReadOnly?: boolean;
    onChange?: (value: string) => any;
}

class FileField extends React.Component<IProps, any> {
    public state = {
        current: this.props.inputValue,
        data: "",
    }

    constructor(props: IProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClear = this.handleClear.bind(this);
    }

    public handleChange(event: any) {
        let val: string = event.target.value;
        val = val.replace("C:\\fakepath\\", "")
        const reader = new FileReader()
        reader.readAsDataURL(event.target.files[0])
        reader.onload = (e: any) => {
            this.setState({...this.state, data: e.target.result})
        }
        this.setState({current: val });
        if (this.props.onChange != null) {
            this.props.onChange(val)
        }
    }

    public handleClear(event: any) {
        if (!this.props.isReadOnly) {
            this.setState({current: "" })
        }
    }

    public render() {
        const { current } = this.state;
        const { extensions, caption, id, isReadOnly, message } = this.props;
        const errorMessage = current !== "" && message? message: "";
        const messageStyle = (errorMessage.length > 0)? "Message CaptionRed BorderTopRed": "Message BorderTopGreen";
        const captionStyle = (errorMessage.length > 0)? "Caption CaptionRed": "Caption CaptionGreen";
        const clearStyle = isReadOnly || current === ""? "Hide": "clearButton";
        const labelContent = (current && current !== "")? current : caption
        const labelStyle = (current && current !== "")? "DataColor" : "CaptionGrey"
        const accept = extensions != null? extensions: ".mp3,.wav";

        return (
            <div id={id} className="FileField">
                <div className="bodyRow">
                    <div className="dataColumn">
                        <label
                            className={captionStyle}>
                            {current && current !== ""? caption: ""
                        }</label>
                        <label
                            className={"fileInput " + labelStyle}
                            data-content={labelContent}
                            htmlFor="Upload"/>
                        <input
                            id="Upload"
                            readOnly={isReadOnly}
                            type="file"
                            accept={accept}
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

export default FileField;
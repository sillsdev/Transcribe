import * as React from 'react';
import './FileNameField.sass';

interface IProps {
    id?: string,
    caption: string,
    inputValue?: string,
    message?: string,
    isReadOnly?: boolean,
    onChange?: (value: string) => any;
}

class FileNameField extends React.Component<IProps, any> {
    public state = {
        current: this.props.inputValue,
    }

    constructor(props: IProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClear = this.handleClear.bind(this);
    }

    public handleChange(event: any) {
        // tslint:disable-next-line:no-console
        console.log(URL.createObjectURL(event.target.files[0]));
        // tslint:disable-next-line:no-console
        console.log(event.target.files[0]);
        let val: string = event.target.value;
        val = val.replace("C:\\fakepath\\", "")
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
        const { caption, id, isReadOnly, message } = this.props;
        const errorMessage = current !== "" && message? message: "";
        const messageStyle = (errorMessage.length > 0)? "Message CaptionRed BorderTopRed": "Message BorderTopGreen";
        const captionStyle = (errorMessage.length > 0)? "Caption CaptionRed": "Caption CaptionGreen";
        const clearStyle = isReadOnly? "Hide": "clearButton";
        const labelContent = (current && current !== "")? current : caption
        const labelStyle = (current && current !== "")? "DataColor" : "CaptionGrey"
        // tslint:disable-next-line:no-console
        console.log('caption='+caption + ', current="'+current+'", label="'+labelContent+'"')

        return (
            <div id={id} className="FileNameField">
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
                            accept=".mp3,.wav"
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

export default FileNameField;
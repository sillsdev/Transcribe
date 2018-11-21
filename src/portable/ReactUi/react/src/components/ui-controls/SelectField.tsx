import * as React from 'react';
import './SelectField.sass';

interface IProps {
    id?: string;
    caption: string;
    direction?: string;
    options: string[];
    selected?: string;
    message?: string;
    onChange?: (value: string) => any;
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
        /* alert("event.target.value: " + event.target.value)
        alert("this.props.caption: " + this.props.caption) */
        if (event.target.value === this.props.caption) {
            this.setState({ current: undefined });
            if (this.props.onChange != null) {
                this.props.onChange("")
            }
        } else {
            this.setState({ current: event.target.value });
            if (this.props.onChange != null) {
                this.props.onChange(event.target.value)
            }
        }
    }

    public render() {
        const { current } = this.state;
        const { caption, direction, id, message, options } = this.props;
        const errorMessage = (current && current !== "" && message != null)? message: "";
        const messageStyle = (errorMessage.length > 0) ? "Message CaptionRed BorderTopRed" : "Message BorderTopGreen";
        const captionStyle = (errorMessage.length > 0) ? "Caption CaptionRed" : "Caption CaptionGreen";
        const dataStyle = (current && current !== "" && current !== caption)? "DataColor": "CaptionGrey";
        let optionsList;
        if(optionsList === undefined) {
            optionsList = [caption].concat(options)
        }
        const elementList = optionsList.map((item: string) =>
            <option key={this.skey(item)} value={this.skey(item)}>{this.svalue(item)}</option>
        );
        // alert("elementList: " + elementList)

        const captionText = (current && current !== "" && current !== caption)? caption: "";

        return (
            <div id={id} className="SelectField">
                <div className="bodyRow">
                    <div className="dataColumn">
                        <label  className={captionStyle}>{captionText}</label>
                        <select className={"Body " + dataStyle + (direction && direction === "rtl"? " rtl": "")}
                            onChange={this.handleChange}
                            defaultValue={current}>
                                {elementList}
                        </select>
                    </div>
                </div>
                <div className={messageStyle}>
                    <label>{message}</label>
                </div>
            </div>
        )
    }

    private skey(item: string) {
        const pieces = item.split(":")
        return pieces.length > 1? pieces[0]: item;
    }

    private svalue(item: string) {
        const pieces = item.split(":")
        return pieces.length > 1? pieces[1]: item;
    }
}

export default TextSelectFieldUx;
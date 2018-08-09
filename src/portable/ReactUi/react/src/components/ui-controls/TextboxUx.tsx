import * as React from 'react';
import ReactTooltip from 'react-tooltip'
import './TextboxUx.sass';

interface IProps {
    inputValue: string,
    isReadOnly: boolean,
    toolTipText: string,
}

class TextBoxUx extends React.Component<IProps, any> {
    public state = {
        message: this.props.inputValue,
        toolTipText: this.props.toolTipText
    }

    constructor(props: IProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public handleChange(event: any) {
        this.setState({ message: event.target.value });
    }

    public render() {
        const { message } = this.state;
        const { isReadOnly } = this.props;
        const cName = (this.state.toolTipText.length > 0)? "TextBoxUxRed": "TextBoxUx";
        const star = (this.state.toolTipText.length > 0)? "\u274C": "";

        return (
            <div>
                <ReactTooltip />
                <input
                    readOnly={isReadOnly}
                    className={isReadOnly? "TextBoxUx-read-only": cName}
                    type="text"
                    value={message}
                    onChange={this.handleChange}
                    data-tip={this.state.toolTipText}/>
                <span className="xMark">&nbsp;{star}</span>
            </div>
        )
    }
};

export default TextBoxUx;

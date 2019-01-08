import * as React from 'react';
import './AnchorHelp.sass';

interface IProps {
    id: string;
    onClick: (value: string) => any;
};

class AnchorHelp extends React.Component<IProps, object> {
    constructor(props: IProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    public handleClick(event: any) {
        this.setState({ ...this.state, current: event.target.value })
        if (this.props.onClick != null) {
            this.props.onClick(event.target.value)
        }
    }

    public render() {
        const { id } = this.props
        return (
            <div id={id} className="AnchorHelp">
                <span>
                    <a key={"a"} className="linkText" onClick={this.handleClick}><img src={"/assets/QuestionGrey.svg"} alt="?" /></a>
                </span>
            </div>
        )
    }
};

export default AnchorHelp;

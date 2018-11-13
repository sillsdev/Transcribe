import * as React from 'react';
import './IconButtonField.sass';

interface IProps {
    id?: string,
    caption: string,
    imageUrl: string,
    bgColor?: string,
    onClick?: (context: any) => any;
}

class IconButtonField extends React.Component<IProps, any> {

    constructor(props: IProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    public handleClick(event: any) {
        this.setState({ current: event.target.value });
        if (this.props.onClick != null) {
            this.props.onClick(event.target.value)
        }
    }

    public render() {
        const { bgColor, caption, id, imageUrl } = this.props;
        const iconButtonStyle = (bgColor !== undefined && bgColor.length > 0) ? "IconButtonField DefaultBgColor" : "IconButtonField"
        return (
            <div id={id} className={iconButtonStyle} onClick={this.handleClick}>
                <img src={"/assets/" + imageUrl} className="CaptionImage" alt={caption && caption.charAt(0).toUpperCase()} />
                <label className="Caption">{caption && caption.toUpperCase()}</label>
            </div>
        )
    }
}

export default IconButtonField;
import * as React from 'react';
import './IconButtonField.sass';

interface IProps {
    id?: string,
    caption: string,
    imageUrl: string,
    bgColor?: string,
    reverse?: boolean,
    hidden?: boolean,
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
        const { bgColor, caption, hidden, id, imageUrl, reverse } = this.props;
        let iconButtonStyle = (bgColor !== undefined && bgColor.length > 0) ? "IconButtonField DefaultBgColor" : "IconButtonField"
        iconButtonStyle = (hidden)? iconButtonStyle + " Hidden" : iconButtonStyle
        const imageStyle = (reverse)? "CaptionImage Reverse":"CaptionImage"
        return (
            <div id={id} className={iconButtonStyle} onClick={this.handleClick}>
                <img src={"/assets/" + imageUrl} className={imageStyle} alt={caption && caption.charAt(0).toUpperCase()} />
                <label className="Caption">{caption && caption.toUpperCase()}</label>
            </div>
        )
    }
}

export default IconButtonField;
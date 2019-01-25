import * as React from 'react';
import './IconButtonField.sass';

interface IProps {
    id?: string;
    caption: string;
    imageUrl: string;
    bgColor?: boolean;
    reverse?: boolean,
    hidden?: boolean,
    changeCaptionSize?: boolean,
    enabled?: boolean,
    onClick?: () => any;
}

export class IconButtonField extends React.Component<IProps, any> {

    constructor(props: IProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    };

    public render() {

        const { bgColor, caption, changeCaptionSize, enabled, hidden, id, imageUrl, reverse } = this.props;
        let iconButtonStyle = (bgColor) ? "IconButtonField DefaultBgColor" : "IconButtonField"
        iconButtonStyle = (hidden)? iconButtonStyle + " Hidden": iconButtonStyle
        iconButtonStyle = (changeCaptionSize)?  iconButtonStyle + " NewSize": iconButtonStyle
        const imageStyle = (reverse)? "CaptionImage Reverse": "CaptionImage"
        const textStyle = (enabled === undefined)? "" : (enabled)? "": " DisableText";
        return (
            <div id={id} className={iconButtonStyle} onClick={this.handleClick}>
                <img src={"/assets/" + imageUrl} className={imageStyle} alt={caption && caption.charAt(0).toUpperCase()} />
                <label className={"Caption" + textStyle}>{caption && caption.toUpperCase()}</label>
            </div>
        )
    };

    private handleClick() {
        if (this.props.onClick != null) {
            this.props.onClick()
        }
    };
};

export default IconButtonField;
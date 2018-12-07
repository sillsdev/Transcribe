import * as React from 'react';
import './IconButtonField.sass';

interface IProps {
    id?: string;
    caption: string;
    imageUrl: string;
    bgColor?: string;
    reverse?: boolean,
    hidden?: boolean,
    onClick?: () => any;
}

export class IconButtonField extends React.Component<IProps, any> {

    constructor(props: IProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    };

    public render() {
        const { bgColor, caption, hidden, id, imageUrl, reverse } = this.props;
        let iconButtonStyle = (bgColor && bgColor.length > 0) ? "IconButtonField DefaultBgColor" : "IconButtonField"
        iconButtonStyle = (hidden)? iconButtonStyle + " Hidden": iconButtonStyle
        const imageStyle = (reverse)? "CaptionImage Reverse": "CaptionImage"
        return (
            <div id={id} className={iconButtonStyle} onClick={this.handleClick}>
                <img src={"/assets/" + imageUrl} className={imageStyle} alt={caption && caption.charAt(0).toUpperCase()} />
                <label className="Caption">{caption && caption.toUpperCase()}</label>
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
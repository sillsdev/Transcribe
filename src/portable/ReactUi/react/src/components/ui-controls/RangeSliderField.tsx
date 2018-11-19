import Slider from 'rc-slider'
import * as React from 'react';
import './RangeSliderField.sass';

interface IProps {
    id?: string,
    caption: string,
    marks: any,
    selected: number,
    onChange?: (context: any) => any;
}

class RangeSliderField extends React.Component<IProps, any> {
    public state = {
        caption: this.props.caption,
        current: this.props.selected,
        id: this.props.id,
        marks: this.props.marks,
    }

    constructor(props: IProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public handleChange(value: number) {
        this.setState({ current: value });
        if (this.props.onChange != null) {
            this.props.onChange(value)
        }
    }

    public render() {
        const { caption, marks } = this.props;
        const { current } = this.state;
        return (            
            <div className="RangeSliderField">
                <div className="SliderCaption"><label className="Caption">{caption}</label></div>
                <div className="SliderStyle"> <Slider min={0} max={3} marks={marks} step={null} onChange={this.handleChange} defaultValue={current} /></div>
            </div>
        )
    }

}


export default RangeSliderField;
import * as React from 'react';
import './RadioListField.sass';

interface IProps {
    id?: string;
    options: string[];
    selected?: string;
    message?: string;
    onChange?: (value: string) => any;
}

class RadioListField extends React.Component<IProps, any> {
    public state = {
        current: this.props.selected,
    }

    constructor(props: IProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public handleChange(event: any) {
        this.setState({ ...this.state, current: event.target.value })
        if (this.props.onChange != null) {
            this.props.onChange(event.target.value)
        }
    }

    public render() {
        const { options } = this.props
        const { current } = this.state
        let currentValue = current;
        if (current !== undefined) {
            currentValue = current.toLowerCase();
        }
        const elementList = options.map((item: string) =>
            <div key={item}>

                <input
                    className="DataColor"
                    type="radio"
                    name="radioGroup"
                    value={item}
                    checked={currentValue === item.toLowerCase()}
                    onChange={this.handleChange} />
                <label className="labelRadioCaption">{item} </label>
            </div>
        );

        return (
            <div className="RadioListField">
                <div className="bodyRow">
                    <div className="dataColumn">
                        <form>
                            <fieldset id="radioGroup" className="radioFieldSet">
                                {elementList}
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default RadioListField;
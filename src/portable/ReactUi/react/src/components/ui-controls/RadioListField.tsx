import * as React from 'react';
import { connect } from 'react-redux';
import { IProjectSettingsStrings } from '../../model/localize';
import { IState } from '../../model/state';
import userStrings from '../../selectors/localize';
import PasswordField from './PasswordField';
import './RadioListField.sass';

interface IProps extends IStateProps {
    id?: string;
    options: string[];
    selected?: string;
    adminPassword?: string;
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

    public handlePasswordChange(event: any) {
        if(event.target === undefined){ return;}
      this.setState({ ...this.state, password: event.target.value });
      if (this.props.onChange != null) {
        this.props.onChange(event.target.value);
      }
    }

    public render() {
        const { adminPassword, options, strings } = this.props
        const { current } = this.state
        const password  = (adminPassword !== undefined)? adminPassword: "";
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
                {(currentValue === "admin" && currentValue === item.toLowerCase()) ? (
                    <div className={"showPasswordField"}>
                        <PasswordField
                            caption={strings.passphrase}
                            id="password"
                            inputValue={password}
                        />
                    </div>
                ) : (
                        ""
                    )}
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

interface IStateProps {
    strings: IProjectSettingsStrings;
};

const mapStateToProps = (state: IState): IStateProps => ({
    strings: userStrings(state, { layout: "projectSettings" }),
});

export default connect(mapStateToProps)(RadioListField);
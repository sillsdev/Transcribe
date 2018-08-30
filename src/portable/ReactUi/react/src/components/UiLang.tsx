import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/userActions';
import { ITranscriberStrings } from '../model/localize';
import { UserLanguages } from '../model/UserLanguages';
import userStrings from '../selectors/localize';
import LabelCaptionUx from './ui-controls/LabelCaptionUx';
import './UiLang.sass';

interface IProps extends IStateProps, IDispatchProps {
};

class UiLang extends React.Component<IProps, object> {
    public render() {

        const languageList = UserLanguages.languages.map((lang: any) => 
            (<li className="list-item"
                onClick={this.selectLanguage.bind(this, lang.split(':')[0])}>{lang.split(':')[1]}</li>))

        return (
            <div className="UiLang">
                <div className="col">
                    <div className="spacer">{"\u00A0"}</div>
                    <div className="row">
                        <div className="spacer">{"\u00A0"}</div>
                        <div className="list">
                            <LabelCaptionUx name={"Select your preferred language:"} />
                            <ul>
                                {languageList}
                            </ul>
                        </div>
                        <div className="spacer">{"\u00A0"}</div>
                    </div>
                    <div className="spacer">{"\u00A0"}</div>
                </div>
            </div>
            )
    }

    private selectLanguage(lang: string) {
        const { selectedUser, selectLanguage } = this.props;
        selectLanguage(selectedUser, lang);
    }
};

interface IStateProps {
    selectedUser: string;
    strings: ITranscriberStrings;
};

const mapStateToProps = (state: any): IStateProps => ({
    selectedUser: state.users.selectedUser,
    strings: userStrings(state, { layout: "transcriber" }),
});

interface IDispatchProps {
    selectLanguage: typeof actions.selectLanguage;
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        selectLanguage: actions.selectLanguage,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UiLang);

import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import { log } from '../actions/logAction';
import * as actions1 from '../actions/taskActions';
import * as actions from '../actions/userActions';
import { IProjectSettingsStrings } from '../model/localize';
import { UserLanguages } from '../model/UserLanguages';
import userStrings from '../selectors/localize';
import NextAction from './controls/NextAction'
import AnchorHelp from './ui-controls/AnchorHelp';
import './UiLang.sass';

interface IProps extends IStateProps, IDispatchProps {
};

class UiLang extends React.Component<IProps, object> {
    public render() {
        const { selectedUser, strings, users } = this.props;
        const currentUser = users.filter((u: IUser) => u.username.id === selectedUser)[0];
        const oslang = (currentUser != null && currentUser.oslang != null) ? currentUser.oslang: "";
        const hasOsLang = UserLanguages.languages.filter((lang: string) => lang.split(':')[0] === oslang);

        log("UiLanguage")
        const languageList = UserLanguages.languages.map((lang: any) => 
            (<li className={"list-item" + (lang.split(':')[0] === oslang ? " selected": "")}
                onClick={this.selectLanguage.bind(this, lang.split(':')[0])}>
                <div className="name">{lang.split(':')[1]}</div>
                <div className="code">{lang.split(':')[0]}</div>
            </li>))

        const selectOsLanguage = () => this.selectOsLanguage(this, selectedUser, oslang);
        const next = hasOsLang.length > 0? (
            <div className="ButtonLink">
                <NextAction text={strings.next.toUpperCase()} target={selectOsLanguage} type="outline-light" />
            </div>): ""

        let wrapper;
        if (currentUser != null) {
            if (currentUser.uilang != null) {
                wrapper = (<Redirect to="/SearchParatextProjects" />)
            } else {
                wrapper = (<div className="list">
                    <div id="ChooseLanguage" className="label">{strings.chooseALanguage}</div>
                    <ul>
                        {languageList}
                    </ul>
                    {next}
                </div>)
            }
        }

        return (
            <div className="UiLang">
                <div className="anchorHelp">
                    <AnchorHelp id="UiLangHelp" onClick={this.ShowUiLangHelp} />
                </div>
                {wrapper}
            </div>
        )
    }

    private ShowUiLangHelp = () => {
        this.props.showHelp("Make a new project")
    }

    private selectLanguage(lang: string) {
        const { selectedUser, selectLanguage } = this.props;
        selectLanguage(selectedUser, lang);
    }

    private selectOsLanguage(ctx: UiLang, selectedUser: string, oslang: string) {
        ctx.props.selectLanguage(selectedUser, oslang);
    }
};

interface IStateProps {
    selectedUser: string;
    strings: IProjectSettingsStrings;
    users: IUser[];
};

const mapStateToProps = (state: any): IStateProps => ({
    selectedUser: state.users.selectedUser,
    strings: userStrings(state, { layout: "projectSettings" }),
    users: state.users.users,
});

interface IDispatchProps {
    selectLanguage: typeof actions.selectLanguage;
    showHelp: typeof actions1.showHelp,
};

const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
    ...bindActionCreators({
        selectLanguage: actions.selectLanguage,
        showHelp: actions1.showHelp,
    }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UiLang);

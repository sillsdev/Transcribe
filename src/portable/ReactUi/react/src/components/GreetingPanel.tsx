import * as React from 'react';
import { ITranscriberStrings } from '../model/localize';
import './GreetingPanel.sass';

class GreetingPanel extends React.Component<IStateProps, any> {
    public render() {
        const { strings } = this.props;

        return (<div className="GreetingPanel">
            <div className="Message">
                <img src={"/assets/Smile.svg"} alt="Wow!!" width="50%" height="50%"/>
                <h1>{strings.congratulations}{"!"}<br />{strings.youhavereached} <br />{strings.inboxzero}. </h1>
                <div><h1>{strings.haveaniceday}</h1></div>
            </div>
        </div>
        )
    }
};

interface IStateProps {
    strings: ITranscriberStrings;
}

export default GreetingPanel;

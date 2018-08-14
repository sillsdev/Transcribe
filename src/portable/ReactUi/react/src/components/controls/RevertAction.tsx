import * as React from 'react';
import * as ReactToolTip from 'react-tooltip';
import { ITranscriberStrings } from '../../model/localize';
import './RevertAction.sass';

interface IProps {
    target: React.MouseEventHandler;
    selected: boolean;
    strings: ITranscriberStrings;
};

class RevertAction extends React.Component<IProps, object> {
    public render() {
        const { selected, strings, target } = this.props;

        return (
            <div className="RevertAction" onClick={target}>
                <div className={selected? "btn-primary": "unselected"} data-tip={strings.unassign}>
                    {"\u2AF6"}
                </div>
                <ReactToolTip />
            </div>
        )
    }
};

export default RevertAction;

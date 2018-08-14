import * as React from 'react';
import './SucessPanel.sass';

class SuccessPanel extends React.Component<any, object> {
    public render() {
        return (<div className="SucessPanel">
            <div className="Message">
                {/* <img src={require('../images.jpg')} alt="Italian Trulli" /> */}
                <h1>You have successfuly submitted your work!!!</h1>
                <h1>Congratulations</h1>
            </div>
        </div>
        )
    }
};



export default SuccessPanel;

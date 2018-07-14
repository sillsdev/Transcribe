import * as React from 'react';
import AudioPanel from './AudioPanel'
import './MainLayout.css';
import NavPanel from './NavPanel'
import TaskPanel from './TaskPanel'

class MainLayout extends React.Component<any> {
    public render() {
        return (<div className="MainLayout">
                    <div className="NavCol">
                        <NavPanel />
                    </div>
                    <div className="TaskCol">
                        <TaskPanel />
                    </div>
                    <div className="MainCol">
                        <AudioPanel />
                    </div>
                </div>
        )
    }
};

export default MainLayout;

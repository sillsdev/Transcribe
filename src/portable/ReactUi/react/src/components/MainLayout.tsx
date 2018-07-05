import * as React from 'react';
import { connect } from 'react-redux';
import Editor from './Editor'
import ProjectPanel from './ProjectPanel'
import TaskPanel from './TaskPanel'

class MainLayout extends React.Component<any> {
    public render() {
        return (
            <div className="homeLayout">
                <table>
                    <tr>
                        <td>
                            <ProjectPanel {...this.props} />
                        </td>
                        <td>
                            <TaskPanel {...this.props} />
                        </td>
                        <td>
                            <Editor {...this.props} />
                        </td>
                    </tr>
                </table>
            </div>
            )
    }
};

const mapStateToProps = (state: any): any => ({
});

export default connect(mapStateToProps)(MainLayout);

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AddManyTasks from './components/AddManyTasks';
import AvatarEdit from './components/AvatarEdit';
import MainLayout from './components/MainLayout';
import NewOrBrowseParatextProjects from './components/NewOrBrowseParatextProject';
import ProjectSettings from './components/ProjectSettings';
import SearchParatextProjects from './components/SearchParatextProjects';
import SelectProject from './components/SelectProject';
import TaskDetails from './components/TaskDetails';
import UiLang from './components/UiLang';
import UserDetails from './components/UserDetails';
import UserLogin from './components/UserLogin';
import UserSettings from './components/UserSettings';
import DevTools from './DevTool'
import './index.sass';
import registerServiceWorker from './registerServiceWorker';
import store from './store';

// https://reacttraining.com/react-router/web/example/basic
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Route exact={true} path="/" component={UserLogin}/>
        <Route path="/project" component={SelectProject} />
        <Route path="/main" component={MainLayout} />
        <Route path="/main/avatar/Project" component={AvatarEdit} />
        <Route path="/settings" component={UserSettings}/>
        <Route path="/settings/avatar/User" component={AvatarEdit} />
        <Route path="/uilang" component={UiLang} />
        <Route path="/SearchParatextProjects" component={SearchParatextProjects} />
        <Route path="/NewOrBrowseParatextProjects" component={NewOrBrowseParatextProjects} />
        <Route path="/ProjectSettings" component={ProjectSettings} />
        <Route path="/ProjectSettings/Task" component={TaskDetails} />
        <Route path="/ProjectSettings/NewTask" component={TaskDetails} />
        <Route path="/ProjectSettings/User" component={UserDetails} />
        <Route path="/ProjectSettings/NewUser" component={UserDetails} />
        <Route path="/ProjectSettings/User/avatar/PopupUser" component={AvatarEdit} />
        <Route path="/ProjectSettings/NewUser/avatar/PopupUser" component={AvatarEdit} />
        <Route path="/ProjectSettings/AddManyTasks" component={AddManyTasks} />
        <Route path="/" component={DevTools} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

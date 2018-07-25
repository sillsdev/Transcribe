import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import SelectProject from './components/SelectProject'
import UserLogin from './components/UserLogin'
import UserSettings from './components/UserSettings';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import store from "./store"

// https://reacttraining.com/react-router/web/example/basic
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Route exact={true} path="/" component={UserLogin}/>
        <Route path="/project" component={SelectProject} />
        <Route path="/main" component={MainLayout} />
        <Route path="/settings" component={UserSettings}/>
      </div>
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

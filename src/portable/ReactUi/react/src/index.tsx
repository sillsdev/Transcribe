import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import UserLogin from './components/UserLogin'
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import store from "./store"

// https://reacttraining.com/react-router/web/example/basic
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route path="/" component={UserLogin}/>
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

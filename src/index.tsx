import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './app/App';
import {store} from 'store/store';
import {Provider} from 'react-redux';
import {HashRouter} from "react-router-dom";

ReactDOM.render(
  <HashRouter>
    <Provider store={store}>
      <App/>
    </Provider>
  </HashRouter>
  , document.getElementById('root'));

serviceWorker.unregister();

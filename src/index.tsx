import React from 'react'

import './index.css'

import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'

import * as serviceWorker from './serviceWorker'

import { App } from 'app/App'
import { store } from 'store/store'

ReactDOM.render(
  <HashRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </HashRouter>,
  document.getElementById('root'),
)

serviceWorker.unregister()

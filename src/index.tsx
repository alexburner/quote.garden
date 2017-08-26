import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { createStore } from 'redux'

import App from 'src/components/App'
import fireapp from 'src/singletons/fireapp'
import reducer from 'src/singletons/reducer'
import { getInitState } from 'src/singletons/state'

console.log(fireapp)

const store = createStore(reducer, getInitState())

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('app'),
)

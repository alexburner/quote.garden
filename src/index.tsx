import { createHashHistory } from 'history'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createStore } from 'redux'

import App from 'src/components/App'
import fireapp from 'src/singletons/fireapp'
import reducer from 'src/singletons/reducer'
import { getInitState } from 'src/singletons/state'

console.log(fireapp)

const history = createHashHistory();
const store = createStore(reducer, getInitState())

// Keep react-router location synced with redux store
store.dispatch({ type: 'location', location: history.location })
history.listen((location) => store.dispatch({ type: 'location', location }))

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app'),
)

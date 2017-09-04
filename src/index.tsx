import { createHashHistory } from 'history'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createStore } from 'redux'
import { install } from 'redux-loop'

import App from 'src/components/App'
import { Action } from 'src/redux/actions'
import reducer from 'src/redux/reducer'
import { getInit } from 'src/redux/state'
import { extractUserPath } from 'src/util'

const history = createHashHistory()
const store = createStore(
  reducer,
  getInit({ currPath: extractUserPath(history.location) }),
  install(),
)

// TODO where to put this?
// Currently viewed user can be changed via URL hash
// And new quotes must be fetched from firebase if that happens
// But only react-router knows about that change
// So here we listen to its history emitter
// So we can pass updates to the redux store
history.listen(location =>
  store.dispatch<Action>({
    type: 'path.curr',
    path: extractUserPath(location),
  }),
)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app'),
)

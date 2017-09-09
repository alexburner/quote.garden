import { createHashHistory, Location } from 'history'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createStore } from 'redux'
import { install } from 'redux-loop'

import App from 'src/components/App'
import { Actions } from 'src/redux/actions'
import reducer from 'src/redux/reducer'
import { getInit, State } from 'src/redux/state'
import { extractUrlId } from 'src/util'

const history = createHashHistory()
const store = createStore<State>(reducer, getInit(), install())

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app'),
)

// TODO where to put this?
// currently viewed user can be changed via URL hash
// and new quotes must be fetched from firebase if that happens
// but only react-router knows about that change
// so here we listen to its history emitter
// so we can pass updates to the redux store
const dispatchUrlId = (location: Location) =>
  store.dispatch<Actions>({
    type: 'UrlIdChange',
    urlId: extractUrlId(location),
  })
dispatchUrlId(history.location) // init
history.listen(dispatchUrlId) // update

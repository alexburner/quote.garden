import { createHashHistory, Location } from 'history'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createStore } from 'redux'
import { install } from 'redux-loop'

import Fireapp from 'src/util/Fireapp'
import { Actions } from 'src/redux/actions'
import reducer from 'src/redux/reducer'
import { getInit, State } from 'src/redux/state'
import { extractUrlId } from 'src/util'

import App from 'src/components/App'

const fireapp = new Fireapp()
const store = createStore<State>(reducer, getInit(), install())
const history = createHashHistory()

// Currently viewed user can be changed via URL hash
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

// Currently authenticated firebase user can only be detected
// by using their library's state change event listener (vs direct query)
// so we must hook that listener and its updates into our redux store
/*

  TODO
  fireapp.onAuthStateChange((user) => {
    store.dispatch<Actions>({
      type: 'AuthStateChange',
      user: user,
    })
  })

  // AND THEN
  case 'AuthStateChange':
    // update state.auth
    // update state.self
    // update state.quotes ? hrmmm depending on location... that gets shitty
                             maybe this right here makes it worth storing
                             separate instances for "self" and "curr" quotes

 */

// Mount component tree
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app'),
)


import { createHashHistory, Location } from 'history'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import {
  applyMiddleware,
  compose,
  createStore,
  GenericStoreEnhancer,
} from 'redux'
import { install } from 'redux-loop'

import Fireapp from 'src/Fireapp'
import { Actions } from 'src/redux/actions'
import reducer from 'src/redux/reducer'
import { getInit, State } from 'src/redux/state'
import { extractUrlId } from 'src/util'

import App from 'src/components/App'

/**
 * TODO TODO TODO
 *
 *   how to pause app initialization
 *   until first authentication?
 *   to prevent mis-redirects
 *   from async responses
 *
 */

const fireapp = new Fireapp()
const enhancer = compose(
  install(),
  applyMiddleware(fireapp.middleware),
) as GenericStoreEnhancer
const store = createStore<State>(reducer, getInit(), enhancer)
const history = createHashHistory()

// Mount component tree
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app'),
)

// Initialize firebase
fireapp.init(store)

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

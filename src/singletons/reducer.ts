import { Cmd, loop } from 'redux-loop'

import { getQuotes } from 'src/singletons/fireapp'
import { Action, State } from 'src/singletons/interfaces'
import { extractUserPath } from 'src/singletons/util'

export default (state: State, action: Action): State => {
  console.log('action!', action, state)
  switch (action.type) {
    case '@@redux/INIT': {
      // Redux startup
      return state
    }
    case 'location': {
      // Browser url hash location changed
      const currPath = extractUserPath(action.location.pathname)
      if (currPath !== state.path.curr) {
        return loop(state, Cmd.action({ type: 'path.curr', path: currPath }))
      }
      return state
    }
    case 'path.curr': {
      // Current user path changed
      return loop(
        {...state, path: { ...state.path, curr: action.path }},
        Cmd.run(getQuotes, {
          args: [{ path: action.path }],
          successActionCreator: (quotes) => ({ type: 'quotes.get', quotes }),
          failActionCreator: (error) => ({ type: 'error', error }),
        })
      )
    }
    case 'quotes.get': {
      // New quotes received

      // TODO

      return state
    }
    default: {
      // Unhandled action
      console.error('Unhandled action:', action)
      return state
    }
  }
}

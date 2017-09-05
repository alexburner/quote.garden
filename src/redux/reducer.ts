import { Cmd, loop } from 'redux-loop'

import { getQuotes } from 'src/fireapp'
import { State } from 'src/interfaces'
import { Action } from 'src/redux/actions'

export default (state: State, action: Action): State => {
  console.log('action!', action, state)
  switch (action.type) {
    case '@@redux/INIT': {
      // Redux startup
      return state
    }

    // TODO actual actions:
    // -- authstart / authcomplete

    // wait wait wait
    // firebase style?

    // resources to listen to:
    // -> auth
    // -> profile (currently just urlId)
    // -> quotes

    // and then also:
    // -> current urlId
    // +> associated quotes

    case 'path.curr': {
      if (action.path === state.path.curr) return state
      // Current user path has changed
      return loop(
        { ...state, path: { ...state.path, curr: action.path } },
        Cmd.run(getQuotes, {
          args: [{ path: action.path }],
          successActionCreator: (quotes): Action => ({
            type: 'quotes.response',
            quotes,
          }),
          failActionCreator: (error): Action => ({ type: 'error', error }),
        }),
      )
    }

    case 'quotes.request': {
      // TODO
      return state
    }

    case 'quotes.response': {
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

import { isEqual } from 'lodash'
import { Cmd, loop } from 'redux-loop'

import { Actions } from 'src/redux/actions'
import { State } from 'src/redux/state'

/**
 * TODO all these
 *
 *   const nState: State = ...
 *   const nAction: Actions = ...
 *
 *  are because redux-loop doesn't have typings
 *  or not good typings, or something
 *  (i need to dig deeper / ask Ashish)
 *
 *  so for now we enforce types like this
 */

export default (state: State, action: Actions): State => {
  console.log('action!', action, state)
  switch (action.type) {
    case '@@redux/INIT': {
      // Redux startup
      return state
    }

    case 'AccountChange': {
      if (isEqual(action.account, state.account)) {
        // No change
        return state
      } else if (!action.account) {
        // No account
        const nState: State = {
          ...state,
          account: null,
          isAuthenticating: false,
          isRegistering: false,
        }
        const nAction: Actions = { type: 'FireappRemoveSelf' }
        return loop(nState, Cmd.action(nAction))
      } else {
        // Account changed
        const nState: State = {
          ...state,
          account: action.account,
          isAuthenticating: false,
          isRegistering: false,
        }
        const nAction: Actions = {
          type: 'FireappUpdateSelf',
          uid: action.account.uid,
        }
        return loop(nState, Cmd.action(nAction))
      }
    }

    case 'AttemptAuth': {
      const nState: State = { ...state, isAuthenticating: true }
      const nAction: Actions = { ...action, type: 'FireappAuthenticate' }
      return loop(nState, Cmd.action(nAction))
    }

    case 'AttemptRegister': {
      const nState: State = { ...state, isRegistering: true }
      const nAction: Actions = { ...action, type: 'FireappRegister' }
      return loop(nState, Cmd.action(nAction))
    }

    case 'CurrProfileChange': {
      return !isEqual(action.profile, state.curr.profile)
        ? { ...state, curr: { ...state.curr, profile: action.profile } }
        : state
    }

    case 'CurrQuotesChange': {
      return !isEqual(action.quotes, state.curr.quotes)
        ? { ...state, curr: { ...state.curr, quotes: action.quotes } }
        : state
    }

    case 'ErrorAuth': {
      return { ...state, isAuthenticating: false }
    }

    case 'ErrorRegister': {
      return { ...state, isRegistering: false }
    }

    case 'SelfProfileChange': {
      return !isEqual(action.profile, state.self.profile)
        ? { ...state, self: { ...state.self, profile: action.profile } }
        : state
    }

    case 'SelfQuotesChange': {
      return !isEqual(action.quotes, state.self.quotes)
        ? { ...state, self: { ...state.self, quotes: action.quotes } }
        : state
    }

    case 'UrlIdChange': {
      if (isEqual(action.urlId, state.urlId)) {
        // No change
        return state
      } else if (!action.urlId) {
        // No current
        const nState: State = { ...state, urlId: null }
        const nAction: Actions = { type: 'FireappRemoveCurr' }
        return loop(nState, Cmd.action(nAction))
      } else {
        // Current changed
        const nState: State = { ...state, urlId: action.urlId }
        const nAction: Actions = {
          type: 'FireappUpdateCurr',
          urlId: action.urlId,
        }
        return loop(nState, Cmd.action(nAction))
      }
    }

    default: {
      // Unhandled action
      console.error('Unhandled action:', action)
      return state
    }
  }
}

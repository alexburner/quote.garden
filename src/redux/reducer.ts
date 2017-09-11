import { isEqual } from 'lodash'
import { Cmd, loop } from 'redux-loop'

import { Actions } from 'src/redux/actions'
import { State } from 'src/redux/state'

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
        return loop(
          { ...state, account: null },
          Cmd.action({ type: 'FireappRemoveSelf' }),
        )
      } else {
        // Account changed
        return loop(
          { ...state, account: action.account },
          Cmd.action({ type: 'FireappUpdateSelf', uid: action.account.uid }),
        )
      }
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
        return loop(
          { ...state, urlId: null },
          Cmd.action({ type: 'FireappRemoveCurr' }),
        )
      } else {
        // Current changed
        return loop(
          { ...state, urlId: action.urlId },
          Cmd.action({ type: 'FireappUpdateCurr', urlId: action.urlId }),
        )
      }
    }

    default: {
      // Unhandled action
      console.error('Unhandled action:', action)
      return state
    }
  }
}

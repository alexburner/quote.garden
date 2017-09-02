import { Action, State } from 'src/singletons/interfaces'

export default (state: State, action: Action): State => {
  switch (action.type) {
    case '@@redux/INIT': {
      return state
    }
    case 'location': {
      console.log(action)
      return state
    }
    default: {
      console.warn('Unhandled action:', action)
      return state
    }
  }
}

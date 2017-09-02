import { Location } from 'history'

interface ActionReduxInit {
  type: '@@redux/INIT'
}

interface ActionLocation {
  type: 'location'
  location: Location
}

export type Action = ActionReduxInit | ActionLocation

export interface State {}

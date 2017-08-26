import * as React from 'react'
import { connect } from 'react-redux'

import { State } from 'src/singletons/interfaces'

interface Props {}

const App = ({  }: Props): JSX.Element => {
  return <div>Hello App</div>
}

const mapStateToProps = ({  }: State): Props => ({})

export default connect(mapStateToProps)(App)

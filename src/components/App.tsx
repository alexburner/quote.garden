import * as React from 'react'
import { connect } from 'react-redux'
import { Route, withRouter } from 'react-router-dom'

import { State } from 'src/singletons/interfaces'

interface Props {}

const App = ({  }: Props): JSX.Element => {
  return (
    <div>
      Hello App
      <Route path="/cheese" render={() => <div>Test</div>} />
    </div>
  )
}

const mapStateToProps = ({  }: State): Props => ({})

export default withRouter(connect(mapStateToProps)(App))

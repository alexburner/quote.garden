import * as React from 'react'
import { connect } from 'react-redux'
import { Route, withRouter } from 'react-router-dom'

import { State } from 'src/singletons/interfaces'

interface Props {}

const Test = () => <div>Test</div>

const App = ({  }: Props): JSX.Element => {
  return (
    <div>
      Hello App
      <Route path="/cheese" component={Test} />
    </div>
  )
}

const mapStateToProps = ({  }: State): Props => ({})

export default withRouter(connect(mapStateToProps)(App))

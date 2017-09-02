import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { State } from 'src/singletons/interfaces'

interface RouteParams {
  userKey: string
}

interface StateProps {}

type Props = StateProps & RouteComponentProps<RouteParams>

const User = ({ match }: Props): JSX.Element => {
  return (
    <div>
      Hello User {match.params.userKey}
    </div>
  )
}

const mapStateToProps = ({  }: State): StateProps => ({})

export default withRouter(connect(mapStateToProps)(User))

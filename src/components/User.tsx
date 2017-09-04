import * as React from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, withRouter } from 'react-router-dom'

import Account from 'src/components/user/Account'
import All from 'src/components/user/All'
import Edit from 'src/components/user/Edit'
import Shuffle from 'src/components/user/Shuffle'
import { State } from 'src/interfaces'
import RemoteData from 'src/util/RemoteData'

interface RouteParams {}

interface StateProps {
  path: {
    curr: string | null
    self: RemoteData<string, Error>
  }
}

type Props = RouteComponentProps<RouteParams> & StateProps

/*
  TODO: redirects!

  for NONE
  - >>> /shuffle

  for EDIT and ACCOUNT
  - if !self >>> auth
  - if curr !== self >>> self/edit|account
*/

const User = ({ path, match: { url } }: Props): JSX.Element =>
  <div>
    {path.curr &&
      <span>
        This is User {path.curr}
      </span>}
    {path.self.success &&
      <span>
        You are User {path.self.success}
      </span>}
    <Route path={`${url}/shuffle/:qnum`} component={Shuffle} />
    <Route path={`${url}/all/:qnum`} component={All} />
    <Route path={`${url}/edit/:qnum`} component={Edit} />
    <Route path={`${url}/account`} component={Account} />
  </div>

const mapStateToProps = ({ path }: State): StateProps => ({ path })

export default withRouter(connect(mapStateToProps)(User))

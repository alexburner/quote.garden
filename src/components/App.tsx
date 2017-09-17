import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'

import { ROOT_USER } from 'src/constants'
import { Profile, User } from 'src/Fireapp'
import { State } from 'src/redux/state'

import Auth from 'src/components/Auth'
import Person from 'src/components/Person'

interface Props {
  user: User | null
  profile: Profile | null
}

const App = ({ user, profile }: Props): JSX.Element => {
  const urlId = user && profile ? profile.urlId : ROOT_USER
  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/:urlId" component={Person} />
      <Redirect exact from="/" to={`/${urlId}`} />
    </Switch>
  )
}

const mapStateToProps = ({ user, self: { profile } }: State): Props => ({
  user,
  profile,
})

export default withRouter(connect(mapStateToProps)(App))

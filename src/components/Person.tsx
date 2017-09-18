import * as React from 'react'
import { connect } from 'react-redux'
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom'

import { Profile, User } from 'src/Fireapp'
import { State } from 'src/redux/state'

import Account from 'src/components/person/Account'
import All from 'src/components/person/All'
import Edit from 'src/components/person/Edit'
import Shuffle from 'src/components/person/Shuffle'

interface RouteParams {
  urlId: string
}

interface StateProps {
  user: User | null
  profile: Profile | null
}

type Props = RouteComponentProps<RouteParams> & StateProps

const Person = ({
  user,
  profile,
  match: { params: { urlId } },
}: Props): JSX.Element => {

  /**
   * TODO TODO TODO
   *
   *   how to pause app initialization
   *   until first authentication?
   *   to prevent mis-redirect
   *   from async responses
   *
   */

  const path = {
    base: `/${urlId}`,
    shuffle: `/${urlId}/shuffle/:qnum?`,
    all: `/${urlId}/all/:qnum?`,
    edit: `/${urlId}/edit/:qnum?`,
    account: `/${urlId}/account`,
  }
  const redirect = {
    auth: '/auth',
    shuffle: `/${urlId}/shuffle`,
    self: {
      edit: profile ? `/${profile.urlId}/edit` : '',
      account: profile ? `/${profile.urlId}/account` : '',
    }

  }
  if (user && profile && profile.urlId === urlId) {
    // Authenticated user viewing themselves
    return (
      <Switch>
        <Route path={path.shuffle} component={Shuffle} />
        <Route path={path.all} component={All} />
        <Route path={path.edit} component={Edit} />
        <Route path={path.account} component={Account} />
        <Redirect exact from={path.base} to={redirect.shuffle} />
      </Switch>
    )
  } else if (user && profile) {
    // Authenticated user viewing someone else
    return (
      <Switch>
        <Route path={path.shuffle} component={Shuffle} />
        <Route path={path.all} component={All} />
        <Redirect exact from={path.base} to={redirect.shuffle} />
        <Redirect exact from={path.edit} to={redirect.self.edit} />
        <Redirect exact from={path.account} to={redirect.self.account} />
      </Switch>
    )
  } else {
    // Unauthenticated user
    return (
      <Switch>
        <Route path={path.shuffle} component={Shuffle} />
        <Route path={path.all} component={All} />
        <Redirect exact from={path.base} to={redirect.shuffle} />
        <Redirect exact from={path.edit} to={redirect.auth} />
        <Redirect exact from={path.account} to={redirect.auth} />
      </Switch>
    )
  }
}

const mapStateToProps = ({ user, self: { profile } }: State): StateProps => ({
  user,
  profile,
})

export default withRouter(connect(mapStateToProps)(Person))

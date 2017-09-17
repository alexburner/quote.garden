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
  if (user && profile && profile.urlId === urlId) {
    // Authenticated user viewing themselves
    return (
      <Switch>
        <Route path={`/${urlId}/shuffle/:qnum?`} component={Shuffle} />
        <Route path={`/${urlId}/all/:qnum?`} component={All} />
        <Route path={`/${urlId}/edit/:qnum?`} component={Edit} />
        <Route path={`/${urlId}/account`} component={Account} />
        <Redirect exact from={`/${urlId}`} to={`/${urlId}/shuffle`} />
      </Switch>
    )
  } else if (user && profile) {
    // Authenticated user viewing someone else
    return (
      <Switch>
        <Route path={`/${urlId}/shuffle/:qnum?`} component={Shuffle} />
        <Route path={`/${urlId}/all/:qnum?`} component={All} />
        <Redirect exact from={`/${urlId}`} to={`/${urlId}/shuffle`} />
        <Redirect
          exact
          from={`/${urlId}/edit/:qnum?`}
          to={`${profile.urlId}/edit/:qnum?`}
        />
        <Redirect
          exact
          from={`/${urlId}/account`}
          to={`${profile.urlId}/account`}
        />
      </Switch>
    )
  } else {
    // Unauthenticated user
    return (
      <Switch>
        <Route path={`/${urlId}/shuffle/:qnum?`} component={Shuffle} />
        <Route path={`/${urlId}/all/:qnum?`} component={All} />
        <Redirect exact from={`/${urlId}`} to={`/${urlId}/shuffle`} />
        <Redirect exact from={`/${urlId}/edit/:qnum?`} to="auth" />
        <Redirect exact from={`/${urlId}/account`} to="auth" />
      </Switch>
    )
  }
}

const mapStateToProps = ({ user, self: { profile } }: State): StateProps => ({
  user,
  profile,
})

export default withRouter(connect(mapStateToProps)(Person))

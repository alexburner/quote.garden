import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'

import { Profile, User } from 'src/Fireapp'
import { State } from 'src/redux/state'

import Login from 'src/components/auth/Login'
import Register from 'src/components/auth/Register'

interface Props {
  user: User | null
  profile: Profile | null
}

const Auth = ({ user, profile }: Props): JSX.Element => {
  if (user && profile) return <Redirect to={`/${profile.urlId}/user`} />
  return (
    <div className="container">
      <div className="row">
        <div className="col col-sm-6">
          <Login />
        </div>
        <div className="col col-sm-6">
          <Register />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ user, self: { profile } }: State): Props => ({
  user,
  profile,
})

export default withRouter(connect(mapStateToProps)(Auth))

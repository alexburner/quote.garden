import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'

import { Account, Profile } from 'src/Fireapp'
import { State } from 'src/redux/state'

import Login from 'src/components/auth/Login'
import Register from 'src/components/auth/Register'

interface Props {
  account: Account | null
  profile: Profile | null
}

const Auth = ({ account, profile }: Props): JSX.Element => {
  if (account && profile) return <Redirect to={`/${profile.urlId}/account`} />
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

const mapStateToProps = ({ account, self: { profile } }: State): Props => ({ account, profile })

export default withRouter(connect(mapStateToProps)(Auth))

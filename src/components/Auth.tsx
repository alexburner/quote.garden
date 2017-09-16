import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { State } from 'src/redux/state'

import Login from 'src/components/auth/Login'

interface Props {}

const Auth = ({  }: Props): JSX.Element => {
  return (
    <div className="container">
      <div className="row">
        <div className="col col-sm-6">
          <Login />
        </div>
        <div className="col col-sm-6">
          <Login />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({  }: State): Props => ({})

export default withRouter(connect(mapStateToProps)(Auth))

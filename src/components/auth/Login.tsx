import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Dispatch } from 'redux'

import { Actions } from 'src/redux/actions'
import { State } from 'src/redux/state'

interface StateProps {
  isAuthenticating: boolean
}

interface DispatchProps {
  attemptAuth: (email: string, pass: string) => void
}

type Props = StateProps & DispatchProps

interface OwnState {
  email: string
  pass: string
}

class Login extends React.Component<Props, OwnState> {
  private handleEmail: (e: React.FormEvent<HTMLInputElement>) => void
  private handlePass: (e: React.FormEvent<HTMLInputElement>) => void
  private handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void

  constructor({ attemptAuth }: Props) {
    super()
    this.state = {
      email: '',
      pass: '',
    }
    this.handleEmail = e => this.setState({ email: e.currentTarget.value })
    this.handlePass = e => this.setState({ pass: e.currentTarget.value })
    this.handleSubmit = e => {
      e.preventDefault()
      if (!this.state.email.length) return alert('Error: email is required.')
      if (!this.state.pass.length) return alert('Error: password is required.')
      attemptAuth(this.state.email, this.state.pass)
    }
  }

  public render() {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={this.handleEmail}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={this.state.pass}
              onChange={this.handlePass}
            />
          </div>
          <div className="form-group">
            <input
              className="btn"
              type="submit"
              value="Login"
              disabled={
                this.props.isAuthenticating ||
                !this.state.email.length ||
                !this.state.pass.length
              }
            />
            {this.props.isAuthenticating && (
              <i className="fa fa-refresh fa-spin" />
            )}
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = ({ isAuthenticating }: State): StateProps => ({
  isAuthenticating,
})

const mapDispatchToProps = (dispatch: Dispatch<State>): DispatchProps => ({
  attemptAuth: (email: string, pass: string) =>
    dispatch<Actions>({
      type: 'AttemptAuth',
      email,
      pass,
    }),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))

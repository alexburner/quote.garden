import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Dispatch } from 'redux'

import { Actions } from 'src/redux/actions'
import { State } from 'src/redux/state'

interface StateProps {
  isRegistering: boolean
}

interface DispatchProps {
  attemptRegister: (email: string, pass: string) => void
}

type Props = StateProps & DispatchProps

interface OwnState {
  email: string
  pass: string
  rpass: string
}

class Login extends React.Component<Props, OwnState> {
  private handleEmail: (e: React.FormEvent<HTMLInputElement>) => void
  private handlePass: (e: React.FormEvent<HTMLInputElement>) => void
  private handleRpass: (e: React.FormEvent<HTMLInputElement>) => void
  private handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void

  constructor({ attemptRegister }: Props) {
    super()
    this.state = {
      email: '',
      pass: '',
      rpass: '',
    }
    this.handleEmail = e => this.setState({ email: e.currentTarget.value })
    this.handlePass = e => this.setState({ pass: e.currentTarget.value })
    this.handleRpass = e => this.setState({ rpass: e.currentTarget.value })
    this.handleSubmit = e => {
      e.preventDefault()
      if (!this.state.email.length) return alert('Error: email is required.')
      if (!this.state.pass.length) return alert('Error: password is required.')
      if (this.state.pass !== this.state.rpass) {
        return alert('Error: passwords do not match.')
      }
      attemptRegister(this.state.email, this.state.pass)
    }
  }

  public render() {
    return (
      <div>
        <h1>Register</h1>
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
              type="password"
              placeholder="Repeat password"
              value={this.state.rpass}
              onChange={this.handleRpass}
            />
          </div>
          <div className="form-group">
            <input
              className="btn"
              type="submit"
              value="Register"
              disabled={
                this.props.isRegistering ||
                !this.state.email.length ||
                !this.state.pass.length ||
                !this.state.rpass.length ||
                this.state.pass !== this.state.rpass
              }
            />
            {this.props.isRegistering && (
              <i className="fa fa-refresh fa-spin" />
            )}
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = ({ isRegistering }: State): StateProps => ({
  isRegistering,
})

const mapDispatchToProps = (dispatch: Dispatch<State>): DispatchProps => ({
  attemptRegister: (email: string, pass: string) =>
    dispatch<Actions>({
      type: 'AttemptRegister',
      email,
      pass,
    }),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))

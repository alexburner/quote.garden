import React from 'react';

import fireapp from 'shared/fireapp.jsx';

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      isSubmitting: false,
      email: '',
      pass: '',
    };
    this.handleEmail = (event) => this.setState({email: event.target.value});
    this.handlePass = (event) => this.setState({pass: event.target.value});
    this.handleSubmit = (event) => {
      event.preventDefault();
      this.setState({isSubmitting: true});
      fireapp.auth().signInWithEmailAndPassword(
        this.state.email,
        this.state.pass
      ).catch((err) => {
        console.error('Login error', err);
        alert(err.message);
      }).then(() => this.setState({
        isSubmitting: false
      }));
    };
  }

  render() {
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
                this.state.isSubmitting ||
                !this.state.email.length ||
                !this.state.pass.length
              }
            />
            {
              this.state.isSubmitting &&
              <i className="fa fa-refresh fa-spin"></i>
            }
          </div>
        </form>
      </div>
    );
  }
}
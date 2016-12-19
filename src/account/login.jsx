import React from 'react';

import fireapp from 'shared/fireapp.jsx';

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      pass: '',
    };
    this.handleEmail = (event) => this.setState({email: event.target.value});
    this.handlePass = (event) => this.setState({pass: event.target.value});
    this.handleSubmit = (event) => {
      event.preventDefault();
      fireapp.auth().signInWithEmailAndPassword(
        this.state.email,
        this.state.pass
      ).catch((err) => {
        console.error('Login error', err);
        alert(err.message);
      });
    };
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset>
          <legend>Login</legend>
          <div>
            <label>
              Email:&nbsp;
              <input
                type="email"
                value={this.state.email}
                onChange={this.handleEmail}
              />
            </label>
          </div>
          <div>
            <label>
              Password:&nbsp;
              <input
                type="password"
                value={this.state.pass}
                onChange={this.handlePass}
              />
            </label>
          </div>
          <input type="submit" value="Login" />
        </fieldset>
      </form>
    );
  }
}
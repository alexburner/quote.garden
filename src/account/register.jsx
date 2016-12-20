import React from 'react';

import fireapp from 'shared/fireapp.jsx';

export default class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      pass: '',
      rpass: '',
    };
    this.handleEmail = (event) => this.setState({email: event.target.value});
    this.handlePass = (event) => this.setState({pass: event.target.value});
    this.handleRpass = (event) => this.setState({rpass: event.target.value});
    this.handleSubmit = (event) => {
      event.preventDefault();
      if (this.state.pass !== this.state.rpass) {
        return alert('Error: passwords do not match');
      }
      fireapp.auth().createUserWithEmailAndPassword(
        this.state.email,
        this.state.pass
      ).catch((err) => {
        console.error('Register error', err);
        alert(err.message);
      });
    };
  }

  render() {
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
              value="Login"
            />
          </div>
        </form>
      </div>
    );
  }
}
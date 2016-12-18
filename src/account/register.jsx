import React from 'react';

import fireapp from 'shared/fireapp.jsx';

export default class Register extends React.Component {
  constructor() {
    super();
    this.state = {email: '', pass: '', rpass: ''};
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
      <form onSubmit={this.handleSubmit}>
        <fieldset>
          <legend>Register</legend>
          <div>
            <label>
              Email:&nbsp;
              <input type="email" onChange={this.handleEmail} />
            </label>
          </div>
          <div>
            <label>
              Password:&nbsp;
              <input type="password" onChange={this.handlePass} />
            </label>
          </div>
          <div>
            <label>
              Repeat password:&nbsp;
              <input type="password" onChange={this.handleRpass} />
            </label>
          </div>
          <input type="submit" value="Submit" />
        </fieldset>
      </form>
    );
  }
}
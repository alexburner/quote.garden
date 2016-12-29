import React from 'react';

import fireapp from 'shared/fireapp.jsx';

export default class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      isSubmitting: false,
      email: '',
      pass: '',
      rpass: '',
    };
    this.handleEmail = (event) => this.setState({email: event.target.value});
    this.handlePass = (event) => this.setState({pass: event.target.value});
    this.handleRpass = (event) => this.setState({rpass: event.target.value});
    this.handleSubmit = (event) => {
      event.preventDefault();
      this.setState({isSubmitting: true});
      if (this.state.pass !== this.state.rpass) {
        return alert('Error: passwords do not match');
      }
      fireapp.auth().createUserWithEmailAndPassword(
        this.state.email,
        this.state.pass
      ).then(user => {
        if (!user) throw new Error('Something went wrong.');

        console.log('set displayName', user.uid);

        return user.updateProfile({displayName: user.uid});
      }).catch((err) => {
        console.error('Register error:', err);
        alert(err.message);
        this.setState({
          isSubmitting: false
        });
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
              value="Register"
              disabled={
                this.state.isSubmitting ||
                !this.state.email.length ||
                !this.state.pass.length ||
                !this.state.rpass.length ||
                this.state.pass !== this.state.rpass
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
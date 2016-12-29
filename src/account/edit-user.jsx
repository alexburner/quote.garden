import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import TopNav from 'shared/top-nav.jsx';

export default class EditUser extends React.Component {
  constructor() {
    super();
    const user = fireapp.auth().currentUser;
    this.state = {
      user: user,
      newEmail: user.email,
      newPass: '',
      newRpass: '',
      pass: '',
    };
    this.unsubscribes = [];
  }

  componentDidMount() {
    this.unsubscribes.push(
      fireapp.auth().onAuthStateChanged((user) => {
        this.setState({user: user});
      })
    );
  }

  componentWillUnmount() {
    this.unsubscribes.forEach((fn) => fn());
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row form-group">
          <div className="col col-sm-3">
            <label className="label-inline" htmlFor="new_email">
              Update email:
            </label>
          </div>
          <div className="col col-sm-9">
            <input
              id="new_email"
              type="email"
              value={this.state.newEmail}
            />
          </div>
        </div>
        <div className="row form-group">
          <div className="col col-sm-3">
            <label className="label-inline" htmlFor="new_pass">
              Update password:
            </label>
          </div>
          <div className="col col-sm-9">
            <input
              id="new_pass"
              type="password"
              value={this.state.newPass}
            />
          </div>
        </div>
        <div className="row form-group">
          <div className="col col-sm-3">
            <label className="label-inline" htmlFor="new_rpass">
              Repeat password:
            </label>
          </div>
          <div className="col col-sm-9">
            <input
              id="new_rpass"
              type="password"
              value={this.state.newRpass}
            />
          </div>
        </div>
        <div className="row form-group">
          <div className="col col-sm-3">
            <label className="label-inline" htmlFor="pass">
              Current password:
            </label>
          </div>
          <div className="col col-sm-9">
            <input
              id="pass"
              type="password"
              value={this.state.pass}
            />
          </div>
        </div>
        <div className="form-group text-right">
          <input
            className="btn"
            type="submit"
            value="Save Changes"
          />
        </div>
      </form>
    );
  }
}
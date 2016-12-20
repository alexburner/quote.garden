import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import TopNav from 'shared/top-nav.jsx';

export default class AccountCredentials extends React.Component {
  constructor() {
    super();
    const user = fireapp.auth().currentUser;
    this.state = {
      user: user,
      new_email: user.email,
      new_pass: '',
      new_rpass: '',
      pass: '',
    };
    this.unsubscribes = [];
    this.handleDelete = () => {
      if (window.confirm('Delete account? This cannot be undone.')) {
        fireapp.auth().currentUser.delete();
        // TODO delete quotes n such
      }
    };
  }

  componentDidMount() {
    this.unsubscribes.push(
      fireapp.auth().onAuthStateChanged((user) => {
        this.setState({user: user});
      })
    );
  }

  componentWillUnmount() {
    this.unsubscribes.forEach((unsubscribe) => unsubscribe());
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
              value={this.state.new_email}
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
              value={this.state.new_pass}
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
              value={this.state.new_rpass}
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
          <button
            className="btn btn-red"
            onClick={this.handleDelete}
          >Delete Account</button>
        </div>
      </form>
    );
  }
}
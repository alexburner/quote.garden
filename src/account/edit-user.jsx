import React from 'react';

import {fireapp, firebase} from 'shared/fireapp.jsx';

import TopNav from 'shared/top-nav.jsx';

export default class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      statusMessage: '',
      newEmail: this.props.user.email,
      newPass: '',
      newRpass: '',
      pass: '',
    };
    this.handleNewEmail = (event) => {
      this.setState({newEmail: event.target.value});
    };
    this.handleNewPass = (event) => {
      this.setState({newPass: event.target.value});
    };
    this.handleNewRpass = (event) => {
      this.setState({newRpass: event.target.value});
    };
    this.handlePass = (event) => {
      this.setState({pass: event.target.value});
    };
    this.handleSubmit = (event) => {
      event.preventDefault();
      const user = this.props.user;
      const newEmail = this.state.newEmail.trim();
      const newPass = this.state.newPass;
      const newRpass = this.state.newRpass;
      const pass = this.state.pass;
      if (!this.hasChanges()) {
        return alert('No changes to save.');
      }
      if (!pass.length) {
        return alert('Error: current password is required.');
      }
      if (this.hasNewPass() && newPass !== newRpass) {
        return alert('Error: new passwords do not match.');
      }
      this.setState({isSubmitting: true});
      user.reauthenticate(
        firebase.auth.EmailAuthProvider.credential(user.email, pass)
      )
        .then(() => Promise.all([
          this.hasNewEmail() ? user.updateEmail(newEmail) : null,
          this.hasNewPass() ? user.updatePassword(newPass) : null,
        ]))
        .then(() => {
          this.setState({
            newEmail: newEmail,
            newPass: '',
            newRpass: '',
            pass: ''
          });
          this.setState({statusMessage: 'Changes saved!'});
          setTimeout(() => this.setState({statusMessage: ''}), 1500);
        })
        .catch((err) => alert(err.message))
        .then(() => this.setState({isSubmitting: false}))
      ;
    };
  }

  hasNewEmail() {
    return (
      this.state.newEmail.length &&
      this.state.newEmail !== this.props.user.email
    );
  }

  hasNewPass() {
    return Boolean(this.state.newPass.length);
  }

  hasChanges() {
    return this.hasNewEmail() || this.hasNewPass();
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
              onChange={this.handleNewEmail}
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
              onChange={this.handleNewPass}
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
              onChange={this.handleNewRpass}
            />
          </div>
        </div>
        <div className="row form-group">
          <div className="col col-sm-12">
            <hr />
          </div>
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
              onChange={this.handlePass}
            />
          </div>
        </div>
        <div className="form-group text-right">
          <span className="text-small text-muted">
            {this.state.statusMessage}
          </span>
          {
            this.state.isSubmitting &&
            <i className="fa fa-refresh fa-spin"></i>
          }
          <input
            className="btn"
            type="submit"
            value="Save Changes"
            disabled={
              this.state.isSubmitting ||
              !this.hasChanges() ||
              (
                this.state.newPass.length &&
                this.state.newPass !== this.state.newRpass
              ) ||
              !this.state.pass.length
            }
          />
        </div>
      </form>
    );
  }
}
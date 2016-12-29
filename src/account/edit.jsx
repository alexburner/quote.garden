import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import EditUser from 'account/edit-user.jsx';
import EditProfile from 'account/edit-profile.jsx';
import TopNav from 'shared/top-nav.jsx';

export default class Edit extends React.Component {
  constructor() {
    super();
    const user = fireapp.auth().currentUser;
    this.state = {
      user: user,
    };
    this.unsubscribes = [];
    this.handleLogout = (event) => {
      event.preventDefault();
      fireapp.auth().signOut();
    }
    this.handleDelete = (event) => {
      event.preventDefault();
      const email = window.prompt(
        'Delete account? This cannot be undone.\n' +
        'Enter your email address to continue:'
      );
      if (email === this.state.user.email) {
        fireapp.auth().currentUser.delete().then(() => {
          // TODO delete quotes n such
        }).catch((err) => {
          console.error('Delete account error:', err);
          alert(err.message);
        });
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
    this.unsubscribes.forEach((fn) => fn());
  }

  render() {
    return (
      <div className="container">
        <div className="controls pull-left">
          <button
            className="btn pull-left"
            onClick={this.handleLogout}
          >Logout</button>
          <button
            className="btn btn-red"
            onClick={this.handleDelete}
          >Delete</button>
        </div>
        <TopNav />
        <h1>Account</h1>
        <EditProfile />
        <EditUser />
      </div>
    );
  }
}
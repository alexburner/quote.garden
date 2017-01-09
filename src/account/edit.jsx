import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import EditUser from 'account/edit-user.jsx';
import EditUrl from 'account/edit-url.jsx';
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
        </div>
        <TopNav />
        <h1>Account</h1>
        <EditUrl />
        <EditUser />
      </div>
    );
  }
}
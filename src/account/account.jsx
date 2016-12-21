import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import AccountCredentials from 'account/account-credentials.jsx';
import AccountVanity from 'account/account-vanity.jsx';
import TopNav from 'shared/top-nav.jsx';

export default class Account extends React.Component {
  constructor() {
    super();
    const user = fireapp.auth().currentUser;
    this.state = {
      user: user,
    };
    this.unsubscribes = [];
    this.handleLogout = () => fireapp.auth().signOut();
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
        <button
          className="btn pull-left"
          onClick={this.handleLogout}
        >Logout</button>
        <TopNav />
        <h1>Account</h1>
        <AccountVanity />
        <AccountCredentials />
      </div>
    );
  }
}
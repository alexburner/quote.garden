import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import TopNav from 'shared/top-nav.jsx'

export default class Account extends React.Component {
  constructor() {
    super();
    this.state = {
      user: fireapp.auth().currentUser,
    };
    this.handleLogout = () => fireapp.auth().signOut();
    this.handleDelete = () => fireapp.auth().currentUser.delete();
  }

  componentDidMount() {
    fireapp.auth().onAuthStateChanged((user) => {
      this.setState({user: user});
    });
  }

  render() {
    return (
      <div>
        <TopNav />
        <form onSubmit={this.handleSubmit}>
          <fieldset>
            <legend>Account</legend>
            <div>
              <label>
                Email:&nbsp;
                {this.state.user.email}
              </label>
            </div>
            <div>
              <label>
                Password:&nbsp;
                {this.state.user.password}
              </label>
            </div>
          </fieldset>
        </form>
        <button onClick={this.handleLogout}>Logout Account</button>
        <button onClick={this.handleDelete}>Delete Account</button>
      </div>
    );
  }
}
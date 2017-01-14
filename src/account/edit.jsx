import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import EditUser from 'account/edit-user.jsx';
import EditUrl from 'account/edit-url.jsx';
import TopNav from 'shared/top-nav.jsx';

export default class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = (event) => {
      event.preventDefault();
      fireapp.auth().signOut();
    }
  }

  render() {
    return (
      <div className="container">
        <TopNav currentUser={this.props.currentUser} viewName="account" />
        <h1>
          Account
          &thinsp;
          <button
            className="btn"
            onClick={this.handleLogout}
          >Logout</button>
        </h1>
        <EditUrl user={this.props.currentUser} />
        <EditUser user={this.props.currentUser} />
      </div>
    );
  }
}
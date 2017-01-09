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
        <div className="controls pull-left">
          <button
            className="btn pull-left"
            onClick={this.handleLogout}
          >Logout</button>
        </div>
        <TopNav user={this.props.user} />
        <h1>Account</h1>
        <EditUrl user={this.props.user} />
        <EditUser user={this.props.user} />
      </div>
    );
  }
}
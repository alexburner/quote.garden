import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import EditUser from 'account/edit-user.jsx';
import EditUrl from 'account/edit-url.jsx';

export default class Edit extends React.Component {
  render() {
    return (
      <div className="container">
        <h1>Account</h1>
        <EditUrl user={this.props.user} />
        <EditUser user={this.props.user} />
      </div>
    );
  }
}
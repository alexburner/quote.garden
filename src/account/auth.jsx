import React from 'react';

import Login from 'account/login.jsx';
import Register from 'account/register.jsx';

export default class Auth extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col col-sm-6">
            <Login />
          </div>
          <div className="col col-sm-6">
            <Register />
          </div>
        </div>
      </div>
    );
  }
}
import React from 'react';

import Login from 'account/login.jsx';
import Register from 'account/register.jsx';

export default class LoginRegister extends React.Component {
  render() {
    return (
      <div>
        <Login />
        <Register />
      </div>
    );
  }
}
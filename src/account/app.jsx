import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import fireapp from 'shared/fireapp.jsx';

import Account from 'account/account.jsx';
import LoginRegister from 'account/login-register.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isAuthed: fireapp.auth().currentUser,
    };
  }

  componentDidMount() {
    fireapp.auth().onAuthStateChanged((user) => {
      this.setState({isAuthed: Boolean(user)});
    });
  }

  render() {
    return this.state.isAuthed ?
      <Account /> : <LoginRegister />
    ;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
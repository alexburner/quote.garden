import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import fireapp from 'shared/fireapp.jsx';

import Account from 'account/account.jsx';
import Loading from 'shared/loading.jsx';
import LoginRegister from 'account/login-register.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      userLoaded: false,
      user: fireapp.auth().currentUser,
    };
    this.unsubscribes = [];
  }

  componentDidMount() {
    this.unsubscribes.push(
      fireapp.auth().onAuthStateChanged((user) => {
        this.setState({
          userLoaded: true,
          user: user,
        })
      })
    );
  }

  componentWillUnmount() {
    this.unsubscribes.forEach((fn) => fn());
  }

  render() {
    return !this.state.userLoaded ?
      <Loading /> :
      this.state.user ?
        <Account /> :
        <LoginRegister />
    ;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
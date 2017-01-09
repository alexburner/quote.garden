import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import fireapp from 'shared/fireapp.jsx';

import Edit from 'edit/edit.jsx';
import Loading from 'shared/loading.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.unsubscribes = [];
    this.state = {
      userLoaded: false,
      user: fireapp.auth().currentUser,
    };
  }

  componentDidMount() {
    this.unsubscribes.push(
      fireapp.auth().onAuthStateChanged((user) => {
        this.setState({
          userLoaded: true,
          user: user,
        });
      })
    );
  }

  componentWillUnmount() {
    this.unsubscribes.forEach((fn) => fn());
  }

  render() {
    return !this.state.userLoaded ?
      <Loading /> :
      !this.state.user ?
        <p>
          You must&nbsp;
          <a href="/account">Login or Register</a>
          &nbsp;to use this page
        </p> :
        <Edit user={this.state.user} />
    ;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
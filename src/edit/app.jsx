import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import fireapp from 'shared/fireapp.jsx';

import Edit from 'edit/edit.jsx';
import Loading from 'shared/loading.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoaded: false,
      user: fireapp.auth().currentUser,
    };
  }

  componentDidMount() {
    fireapp.auth().onAuthStateChanged((user) => {
      this.setState({
        isLoaded: true,
        user: user,
      })
    });
  }

  render() {
    return !this.state.isLoaded ?
      <Loading /> :
      this.state.user ?
        <Edit /> :
        <p>
          You must&nbsp;
          <a href="/account">Login or Register</a>
          &nbsp;to use this page
        </p>
    ;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
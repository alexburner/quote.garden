import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import fireapp from 'shared/fireapp.jsx';

import Loading from 'shared/loading.jsx';
import All from 'all/all.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.unsubscribes = [];
    this.state = {
      userLoaded: false,
      user: null,
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
      <All user={this.state.user}/>
    ;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
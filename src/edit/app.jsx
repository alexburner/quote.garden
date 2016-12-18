import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import fireapp from 'shared/fireapp.jsx';

import Edit from 'edit/edit.jsx';

class App extends React.Component {
  render() {
    return fireapp.auth().currentUser ?
      <Edit /> :
      <p>
        You must&nbsp;
        <a href="/account">Login or Register</a>
        &nbsp;to use this page.
      </p>
    ;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
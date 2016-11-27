import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import fireapp from 'shared/fireapp.jsx';
import QuoteAdd from 'edit/quote-add.jsx';

class App extends React.Component {
  componentWillMount() {
    // fireapp.database().ref()
  }
  render() {
    return (
      <div>
        <h1>Hello edit app</h1>
        <QuoteAdd></QuoteAdd>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
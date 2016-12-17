import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import fireapp from 'shared/fireapp.jsx';
import QuoteAdd from 'edit/quote-add.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.firedb = fireapp.database();
    this.state = {
      test: null,
    };
  }
  componentWillMount() {
    this.firedb.ref('test').on('value', (snapshot) => {
      this.setState({
        test: snapshot.val(),
      });
    });
  }
  render() {
    return (
      <div>
        <h1>Hello edit app</h1>
        <p>Test: {this.state.test}</p>
        <QuoteAdd></QuoteAdd>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
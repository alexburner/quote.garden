import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import QuoteAdd from 'edit/quote-add.jsx';

export default class Edit extends React.Component {
  constructor() {
    super();
    this.firedb = fireapp.database();
    this.state = {
      test: null,
    };
  }

  componentDidMount() {
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
        <p>Test: {this.state.test ? this.state.test : 'Loading...'}</p>
        <QuoteAdd></QuoteAdd>
      </div>
    );
  }
}
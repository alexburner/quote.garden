import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import Loading from 'shared/loading.jsx';

export default class All extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isQuotesLoaded: false,
      quotes: [],
    };
    this.handleQuotes = (snapshot) => {
      const quotes = [];
      if (snapshot && snapshot.val()) {
        snapshot.forEach((snapshot) => {
          const quote = snapshot.val();
          quote.key = snapshot.key;
          quotes.unshift(quote);
        });
      }
      this.setState({
        isQuotesLoaded: true,
        quotes: quotes,
      });
    };
  }

  setupFirebase(userId) {
    this.quotesRef = fireapp.database().ref('quotes/' + userId);
    this.quotesRef.on('value', this.handleQuotes);
  }

  teardownFirebase() {
    this.quotesRef.off('value', this.handleQuotes);
  }

  componentDidMount() {
    this.setupFirebase(this.props.userId);
  }

  componentWillUnmount() {
    this.teardownFirebase();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userId !== nextProps.userId) {
      this.teardownFirebase();
      this.setupFirebase(nextProps.userId);
    }
  }

  render() {
    return !this.state.isQuotesLoaded ?
      <Loading /> :
      <div className="quotes">
        {!this.state.quotes.length ?
          <h1>No quotes yet...</h1> :
          this.state.quotes.map((quote) => (
            <div
              className="quote"
              key={quote.key}
            >
              <h1>{quote.words}</h1>
              <h3>{quote.source}</h3>
            </div>
          ))
        }
      </div>
    ;
  }
}
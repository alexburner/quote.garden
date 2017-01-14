import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import Loading from 'shared/loading.jsx';
import QuoteForm from 'edit/quote-form.jsx';

export default class QuoteForms extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscribes = [];
    this.state = {
      isQuotesLoaded: false,
      quotes: [],
    };
    this.quotesRef = fireapp.database().ref('quotes/' + this.props.userId);
  }

  componentDidMount() {
    this.unsubscribes.push(
      this.quotesRef.on('value', (snapshot) => {
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
      })
    );
  }

  componentWillUnmount() {
    this.unsubscribes.forEach((fn) => fn());
  }

  render() {
    return (
      <div>
        {!this.state.isQuotesLoaded ?
          <Loading /> :
          this.state.quotes.length ?
            this.state.quotes.map((quote) => (
              <QuoteForm
                key={quote.key}
                quote={quote}
                userId={this.props.userId}
              />
            )) :
            <small className="text-small text-muted">
              No quotes yet, create one!
            </small>
        }
      </div>
    );
  }
}
import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import Loading from 'shared/loading.jsx';
import QuoteForm from 'edit/quote-form.jsx';

export default class QuoteForms extends React.Component {
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
import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import Loading from 'shared/loading.jsx';
import QuoteForm from 'edit/quote-form.jsx';

export default class QuoteForms extends React.Component {
  constructor() {
    super();
    this.state = {
      quotesLoaded: false,
      quotes: [],
    };
    let userId = fireapp.auth().currentUser.uid;
    this.quotesRef = fireapp.database().ref('quotes/' + userId);
  }

  componentDidMount() {
    this.quotesRef.on('value', (snapshot) => {
      const quotes = [];
      snapshot.forEach((snapshot) => {
        const quote = snapshot.val();
        quote.key = snapshot.key;
        quotes.unshift(quote);
      });
      this.setState({
        quotesLoaded: true,
        quotes: quotes,
      });
    });
  }

  render() {
    return (
      <div>
        {
          !this.state.quotesLoaded ?
            <Loading /> :
            this.state.quotes.length ?
              this.state.quotes.map((quote) => (
                <QuoteForm key={quote.key} quote={quote} />
              )) :
              <small>No quotes exist yet :(</small>
        }
      </div>
    );
  }
}
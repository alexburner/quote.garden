import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import QuoteAdd from 'edit/quote-add.jsx';
import QuoteEdit from 'edit/quote-edit.jsx';
import TopNav from 'shared/top-nav.jsx';

export default class Edit extends React.Component {
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
        <TopNav />
        <h1>New quote</h1>
        <QuoteAdd />
        <h1>Existing quotes</h1>
        {
          !this.state.quotesLoaded ?
            <p>Loading...</p> :
            this.state.quotes.length ?
              this.state.quotes.map((quote) => (
                <QuoteEdit key={quote.key} quote={quote} />
              )) :
              <small>No quotes exist yet :(</small>
        }
      </div>
    );
  }
}
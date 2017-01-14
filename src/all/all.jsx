import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import Loading from 'shared/loading.jsx';
import TopNav from 'shared/top-nav.jsx';

export default class All extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscribes = [];
    this.state = {
      isQuotesLoaded: false,
      quotes: [],
    };
    this.quotesRef = fireapp.database().ref('quotes/' + this.props.viewUserId);
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
      <div className="all">
        <TopNav currentUser={this.props.currentUser} viewName="all" />
        {!this.state.isQuotesLoaded ?
          <Loading /> :
          !this.state.quotes.length ?
            <small className="text-small text-muted">
              No quotes yet, create one!
            </small> :
            <div className="quotes">
              {this.state.quotes.map((quote) => (
                <div
                  className="quote"
                  key={quote.key}
                >
                  <h1>{quote.words}</h1>
                  <h3>{quote.source}</h3>
                </div>
              ))}
            </div>
        }
      </div>
    );
  }
}
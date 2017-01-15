import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import Loading from 'shared/loading.jsx';
import SiteNav from 'shared/site-nav.jsx';

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
    this.setupFirebase(this.props.viewUserId);
  }

  componentWillUnmount() {
    this.teardownFirebase();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.viewUserId !== nextProps.viewUserId) {
      this.teardownFirebase();
      this.setupFirebase(nextProps.viewUserId);
    }
  }

  render() {
    return (
      <div>
        <div className="bottom-bar bottom-bar-small">
          <SiteNav currentUser={this.props.currentUser} viewName="all" />
        </div>
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
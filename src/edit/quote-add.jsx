import React from 'react';

import fireapp from 'shared/fireapp.jsx';

export default class QuoteAdd extends React.Component {
  constructor() {
    super();
    this.state = {
      words: '',
      source: '',
    };
    this.handleWords = (event) => this.setState({words: event.target.value});
    this.handleSource = (event) => this.setState({source: event.target.value});
    let userId = fireapp.auth().currentUser.uid;
    let quotesRef = fireapp.database().ref('quotes/' + userId);
    this.handleSubmit = (event) => {
      event.preventDefault();
      quotesRef.push().set({
        words: this.state.words,
        source: this.state.source,
      }).then(this.setState({
        words: '',
        source: '',
      })).catch((err) => {
        console.error('Create error', err);
        alert(err.message);
      });
    };
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset>
          <legend>Create</legend>
          <div>
            <textarea
              placeholder="Add quote here..."
              value={this.state.words}
              onChange={this.handleWords}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Add source here..."
              value={this.state.source}
              onChange={this.handleSource}
            />
          </div>
          <input type="submit" value="Create" />
        </fieldset>
      </form>
    );
  }
};
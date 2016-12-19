import React from 'react';

import fireapp from 'shared/fireapp.jsx';

export default class QuoteEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: props.quote.words,
      source: props.quote.source,
    };
    this.handleWords = (event) => this.setState({words: event.target.value});
    this.handleSource = (event) => this.setState({source: event.target.value});
    let userId = fireapp.auth().currentUser.uid;
    let quoteKey = props.quote.key;
    let quoteRef = fireapp.database().ref(`quotes/${userId}/${quoteKey}`);
    this.handleSubmit = (event) => {
      event.preventDefault();
      quoteRef.set({
        words: this.state.words,
        source: this.state.source,
      }).catch((err) => {
        console.error('Update error', err);
        alert(err.message);
      });
    };
    this.handleDelete = (event) => {
      event.preventDefault();
      quoteRef.remove().catch((err) => {
        console.error('Delete error', err);
        alert(err.message);
      });
    };
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset>
          <legend>Update</legend>
          <div>
            <textarea
              placeholder="Quote goes here..."
              value={this.state.words}
              onChange={this.handleWords}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Source goes here..."
              value={this.state.source}
              onChange={this.handleSource}
            />
          </div>
          <input type="submit" value="Update" />
          <button onClick={this.handleDelete}>Delete</button>
        </fieldset>
      </form>
    );
  }
};
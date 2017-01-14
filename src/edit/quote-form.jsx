import React from 'react';

import fireapp from 'shared/fireapp.jsx';

export default class QuoteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      statusMessage: '',
      words: props.quote ? props.quote.words : '',
      source: props.quote ? props.quote.source : '',
    };
    this.handleWords = (event) => this.setState({words: event.target.value});
    this.handleSource = (event) => this.setState({source: event.target.value});
    this.handleSubmit = (event) => {
      event.preventDefault();
      const words = this.state.words.trim();
      const source = this.state.source.trim();
      this.setState({
        words: words,
        source: source,
        isSubmitting: true,
        statusMessage: '',
      });
      if (props.quote) {
        // Update existing quote
        this.quoteRef.set({
          words: words,
          source: source,
        })
          .then(() => {
            this.setState({statusMessage: 'Changes saved!'});
            setTimeout(() => this.setState({statusMessage: ''}), 1500);
          })
          .catch((err) => alert(err.message))
          .then(() => this.setState({isSubmitting: false}))
        ;
      } else {
        // Create new quote
        this.quoteRef.push().set({
          words: words,
          source: source,
        })
          .then(() => this.setState({words: '', source: ''}))
          .catch((err) => alert(err.message))
          .then(() => this.setState({isSubmitting: false}))
        ;
      }
    };
    this.handleDelete = (event) => {
      event.preventDefault();
      if (window.confirm('Delete quote? This cannot be undone.')) {
        this.quoteRef.remove().catch((err) => {
          alert(err.message);
        });
      }
    };
  }

  setupFirebase(userId, quote) {
    this.quoteRef = quote ?
      fireapp.database().ref(`quotes/${userId}/${quote.key}`) :
      fireapp.database().ref(`quotes/${userId}`)
    ;
  }

  componentDidMount() {
    this.setupFirebase(this.props.userId, this.props.quote);
  }

  componentWillReceiveProps(nextProps) {
    if (
      (this.props.userId !== nextProps.userId) ||
      (this.props.quote && !nextProps.quote) ||
      (!this.props.quote && nextProps.quote) ||
      (
        this.props.quote && nextProps.quote &&
        this.props.quote.key !== nextProps.quote.key
      )
    ) {
      this.setupFirebase(nextProps.userId, nextProps.quote);
    }
  }

  render() {
    return (
      <form className="quote-form" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <textarea
            rows="4"
            placeholder="Quote..."
            value={this.state.words}
            onChange={this.handleWords}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Source..."
            value={this.state.source}
            onChange={this.handleSource}
          />
        </div>
        <div className="form-group">
          <input
            className="btn"
            type="submit"
            value={this.props.quote ? 'Update' : 'Create'}
            disabled={
              this.state.isSubmitting ||
              !this.state.words.length ||
              !this.state.source.length ||
              (
                this.props.quote &&
                this.props.quote.words === this.state.words &&
                this.props.quote.source === this.state.source
              )
            }
          />
          {
            this.props.quote &&
            <button
              className="btn btn-red"
              onClick={this.handleDelete}
              disabled={this.state.isSubmitting}
            >Delete</button>
          }
          {
            this.state.isSubmitting &&
            <i className="fa fa-refresh fa-spin"></i>
          }
          <span className="text-small text-muted">
            {this.state.statusMessage}
          </span>
        </div>
      </form>
    );
  }
};
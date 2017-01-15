import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import QuoteForm from 'edit/quote-form.jsx';
import QuoteForms from 'edit/quote-forms.jsx';

export default class Edit extends React.Component {
  render() {
    return (
      <div className="container">
        <h1>Create new</h1>
        <QuoteForm userId={this.props.user.uid} />
        <h1>Edit existing</h1>
        <QuoteForms userId={this.props.user.uid} />
      </div>
    );
  }
}
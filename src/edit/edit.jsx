import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import QuoteForm from 'edit/quote-form.jsx';
import QuoteForms from 'edit/quote-forms.jsx';
import TopNav from 'shared/top-nav.jsx';

export default class Edit extends React.Component {
  render() {
    return (
      <div className="container">
        <TopNav user={this.props.user} />
        <h1>Create new</h1>
        <QuoteForm user={this.props.user} />
        <h1>Edit existing</h1>
        <QuoteForms user={this.props.user} />
      </div>
    );
  }
}
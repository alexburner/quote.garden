import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import QuoteForm from 'edit/quote-form.jsx';
import QuoteForms from 'edit/quote-forms.jsx';
import TopNav from 'shared/top-nav.jsx';

export default class Edit extends React.Component {
  render() {
    return (
      <div className="container">
        <TopNav />
        <h1>New quote</h1>
        <QuoteForm />
        <h1>Existing quotes</h1>
        <QuoteForms />
      </div>
    );
  }
}
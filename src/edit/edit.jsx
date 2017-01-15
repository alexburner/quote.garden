import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import QuoteForm from 'edit/quote-form.jsx';
import QuoteForms from 'edit/quote-forms.jsx';
import SiteNav from 'shared/site-nav.jsx';

export default class Edit extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="bottom-bar bottom-bar-small">
          <SiteNav currentUser={this.props.currentUser} viewName="edit" />
        </div>
        <h1>Create new</h1>
        <QuoteForm userId={this.props.currentUser.uid} />
        <h1>Edit existing</h1>
        <QuoteForms userId={this.props.currentUser.uid} />
      </div>
    );
  }
}
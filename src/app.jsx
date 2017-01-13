// only in code tree root
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import fireapp from 'shared/fireapp.jsx';
import * as constants from 'shared/constants.jsx';
import * as queries from 'shared/queries.jsx';

import Loading from 'shared/loading.jsx';
import TopNav from 'shared/top-nav.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.unsubscribes = [];
    this.state = {
      isLoaded: false,
      currentUser: fireapp.auth().currentUser,
      viewName: null,
      viewUserId: null,
      viewQuoteId: null,
    };
    this.handleHashChange = () => this.updateRoute();
  }

  updateRoute() {
    console.log('hash', window.location.hash);
    console.log('hash split', window.location.hash.split('/'));

    //
    // hash possibilities:
    //                                      >>> #/
    //  #                                   >>> #/
    //  #/                                  >>> #/
    //  #$thing                             >>> #/$thing
    //  #$/thing/                           >>> #/$thing
    //  #/$unknown                          >>> #/$unknown (but render 404)
    //  #/$viewName                         >>> #/default/$viewName
    //  #/$profile.urlId                    >>> #/$profile.urlId/shuffle
    //  #/$profile.urlId/$viewName
    //  #/$profile.urlId/$viewName/$quoteId
    //

    //
    // view possibilities
    //  404 (unnamed >>> current path)
    //  home (unnamed >>> no path)
    //  account
    //  all
    //  edit
    //  shuffle
    //

    const href = window.location.href;
    const hash = window.location.hash;
    const parts = hash.split('/');

    if (!hash.length || !parts.length) {
      // HASH =
      // HASH = #
      // incomplete hash, reload with #/
      return window.location.replace('#/');
    }

    else if (parts[0] !== '#') {
      // HASH = #thing
      // malformed hash, reload with first / inserted
      return window.location.replace('#/' + hash.slice(1));
    }

    else if (parts.length === 2 && !parts[1].length) {
      // HASH = #/
      // no route set, go home with default user
      return queries.getDefaultUserId().then(
        (userId) => this.setState({
          isLoaded: true,
          viewName: 'home',
          viewUserId: userId
        })
      );
    }

    else if (!parts[parts.length - 1].length) {
      // HASH = #/thing/
      // trailing slash, strip it out so we can trust all parts
      return window.location.replace(hash.slice(0, -1));
    }

    else if (constants.VIEW_NAMES[parts[1]]) {
      // HASH = #/$viewName
      // first part is a view name, reload with default user
      return window.location.replace('#/default' + hash.slice(1));
    }

    else {
      // HASH = #/$profile.urlId
      // first part must be a user's profile.urlId (or an error)
      return queries.getUserIdByUrlId(parts[1]).then((userId) => {
        if (!userId) {
          // HASH = #/$unknown
          // no user found, 404 with default user
          return queries.getDefaultUserId().then(
            (userId) => this.setState({
              isLoaded: true,
              viewName: '404',
              viewUserId: userId
            })
          );
        }
        else if (parts[2] && !constants.VIEW_NAMES[parts[2]]) {
          // HASH = #/$profile.urlId/$unknown
          // unrecognized view, 404 with url user
          return this.setState({
            isLoaded: true,
            viewName: '404',
            viewUserId: userId
          });
        }
        else if (parts.length === 2) {
          // HASH = #/$profile.urlId
          // first part is good user, but no view, reload with shuffle
          return window.location.replace('#/' + parts[1] + '/shuffle');
        }
        else {
          // HASH = #/$profile.urlId/$viewName
          // HASH = #/$profile.urlId/$viewName/$quoteId
          // recognized user and view yayy
          return this.setState({
            isLoaded: true,
            viewName: parts[2],
            viewQuoteId: parts[3] || null,
            viewUserId: userId,
          });
        }
      });
    }
  }

  componentDidMount() {
    // add event listeners
    this.unsubscribes.push(
      fireapp.auth().onAuthStateChanged(
        (user) => this.setState({currentUser: user})
      )
    );
    window.addEventListener(
      'hashchange', this.handleHashChange
    );
    this.unsubscribes.push(() => {
      window.removeEventListener(
        'hashchange', this.handleHashChange
      );
    });
    // set current route
    this.updateRoute();
  }

  componentWillUnmount() {
    this.unsubscribes.forEach((fn) => fn());
  }

  render() {
    if (!this.state.isLoaded) {
      return <Loading />
    }
    switch (this.state.viewName) {
      default: return (
        <div>
          <div><code>this.state.viewName = {this.state.viewName}</code></div>
          <div><code>this.state.viewQuoteId = {this.state.viewQuoteId}</code></div>
          <div><code>this.state.viewUserId = {this.state.viewUserId}</code></div>
        </div>
      );
    }
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
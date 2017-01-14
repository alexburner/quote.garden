import 'babel-polyfill'; // only in code tree root

import React from 'react';
import ReactDOM from 'react-dom';

import fireapp from 'shared/fireapp.jsx';
import * as constants from 'shared/constants.jsx';
import * as queries from 'shared/queries.jsx';

import Account from 'account/account.jsx';
import Loading from 'shared/loading.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentUser: null,
      isRouteLoaded: false,
      isUserLoaded: false,
      viewName: null,
      viewQuoteId: null,
      viewUrlId: null,
      viewUserId: null,
    };
    this.handleHashChange = () => this.updateRoute();
  }

  updateRoute() {
    const href = window.location.href;
    const hash = window.location.hash;
    const parts = hash.split('/');

    //
    // views:
    //
    // SILENT
    //  #/<404> (shows current/failed path)
    //
    // ROOT
    //  #/home
    //  #/account
    //
    // USER
    //  #/<urlId>/all
    //  #/<urlId>/edit
    //  #/<urlId>/shuffle/<quoteId>
    //

    //
    // redirects:
    //                        >>>  #/home
    //  #                     >>>  #/home
    //  #/                    >>>  #/home
    //  #<thing>              >>>  #/<thing>
    //  #/<thing>/            >>>  #/<thing>
    //  #/<userView>          >>>  #/default/<userView>
    //  #/<urlId>             >>>  #/<urlId>/shuffle
    //  #/<urlId>/<rootView>  >>>  #/<rootView>
    //

    if (
      !hash.length ||
      !parts.length ||
      (parts.length === 2 && !parts[1].length)
    ) {
      // HASH =
      // HASH = #
      // HASH = #/
      // empty-ish hash, reload with #/home
      return window.location.replace('#/home');
    }

    else if (parts[0] !== '#') {
      // HASH = #thing
      // malformed hash, reload with first / inserted
      return window.location.replace('#/' + hash.slice(1));
    }

    else if (!parts[parts.length - 1].length) {
      // HASH = #/thing/
      // trailing slash, strip it out so we can trust all parts
      return window.location.replace(hash.slice(0, -1));
    }

    else if (constants.ROOT_VIEWS[parts[1]]) {
      // HASH = #/<rootView>
      // first part is a root view name, load it
      return this.setState({
        isRouteLoaded: true,
        viewName: parts[1],
        viewQuoteId: null,
        viewUrlId: null,
        viewUserId: null,
      });
    }

    else if (constants.USER_VIEWS[parts[1]]) {
      // HASH = #/<userView>
      // first part is a user view, reload with default user inserted
      return window.location.replace('#/default' + hash.slice(1));
    }

    else {
      // HASH = #/<urlId>
      // first part must be a user's urlId (or an error)
      return queries.getUserIdByUrlId(parts[1]).then((userId) => {
        if (!userId) {
          // HASH = #/<unknown>
          // unrecognized user, 404
          return this.setState({
            isRouteLoaded: true,
            viewName: '404',
            viewQuoteId: null,
            viewUrlId: null,
            viewUserId: null,
          });
        }
        else if (parts[2] && constants.ROOT_VIEWS[parts[2]]) {
          // HASH = #/<urlId>/<rootView>
          // good user, but second part is root view, reload without urlId
          return window.location.replace('#/' + parts[2]);
        }
        else if (parts[2] && !constants.USER_VIEWS[parts[2]]) {
          // HASH = #/<urlId>/<unknown>
          // unrecognized user view name, 404
          return this.setState({
            isRouteLoaded: true,
            viewName: '404',
            viewQuoteId: null,
            viewUrlId: null,
            viewUserId: null,
          });
        }
        else if (parts.length === 2) {
          // HASH = #/<urlId>
          // good user, but no view, reload with shuffle
          return window.location.replace('#/' + parts[1] + '/shuffle');
        }
        else {
          // HASH = #/<urlId>/<userView>
          // HASH = #/<urlId>/<userView>/<quoteId>
          // recognized user and view yayy
          return this.setState({
            isRouteLoaded: true,
            viewName: parts[2],
            viewQuoteId: parts[3] || null,
            viewUrlId: parts[1],
            viewUserId: userId,
          });
        }
      });
    }
  }

  componentDidMount() {
    // add event listeners
    window.addEventListener('hashchange', this.handleHashChange);
    fireapp.auth().onAuthStateChanged((user) => {
      this.setState({
        currentUser: user,
        isUserLoaded: true,
      });
    });
    // set current route
    this.updateRoute();
  }

  render() {
    if (!this.state.isRouteLoaded || !this.state.isUserLoaded) {
      return <Loading />
    }

    switch (this.state.viewName) {
      case 'account':
        document.title = 'Account — quote.garden';
        return <Account user={this.state.currentUser} />;

      case '404':
        document.title = '404 — quote.garden';
        return (
          <div>
            <div><code>this.state.viewName = {this.state.viewName}</code></div>
            <div><code>this.state.viewQuoteId = {this.state.viewQuoteId}</code></div>
            <div><code>this.state.viewUserId = {this.state.viewUserId}</code></div>
          </div>
        );

      case 'home':
        document.title = 'Home — quote.garden';
        return (
          <div>
            <div><code>this.state.viewName = {this.state.viewName}</code></div>
            <div><code>this.state.viewQuoteId = {this.state.viewQuoteId}</code></div>
            <div><code>this.state.viewUserId = {this.state.viewUserId}</code></div>
          </div>
        );

      case 'all':
        document.title = `All — ${this.state.viewUrlId} — quote.garden`;
        return (
          <div>
            <div><code>this.state.viewName = {this.state.viewName}</code></div>
            <div><code>this.state.viewQuoteId = {this.state.viewQuoteId}</code></div>
            <div><code>this.state.viewUserId = {this.state.viewUserId}</code></div>
          </div>
        );

      case 'edit':
        document.title = `Edit — ${this.state.viewUrlId} — quote.garden`;
        return (
          <div>
            <div><code>this.state.viewName = {this.state.viewName}</code></div>
            <div><code>this.state.viewQuoteId = {this.state.viewQuoteId}</code></div>
            <div><code>this.state.viewUserId = {this.state.viewUserId}</code></div>
          </div>
        );

      case 'shuffle':
        document.title = `Shuffle — ${this.state.viewUrlId} — quote.garden`;
        return (
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
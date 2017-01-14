import 'babel-polyfill'; // only in code tree root

import React from 'react';
import ReactDOM from 'react-dom';

import fireapp from 'shared/fireapp.jsx';
import * as constants from 'shared/constants.jsx';
import * as queries from 'shared/queries.jsx';

import Account from 'account/account.jsx';
import All from 'all/all.jsx';
import Edit from 'edit/edit.jsx';
import Loading from 'shared/loading.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentProfile: null,
      currentUser: null,
      isRouteLoaded: false,
      isUserLoaded: false,
      viewName: null,
      viewQuoteId: null,
      viewUrlId: null,
      viewUserId: null,
    };
  }

  componentDidMount() {
    // add event listeners
    window.addEventListener('hashchange', () => this.updateRoute());
    this.initPromise = new Promise((resolve) => {
      fireapp.auth().onAuthStateChanged((user) => {
        if (user && user.uid) {
          fireapp
            .database()
            .ref('profiles/' + user.uid)
            .once('value', (snapshot) => {
              const profile = snapshot ? snapshot.val() : null;
              this.setState({
                currentProfile: profile,
                currentUser: user,
                isUserLoaded: true,
              }, () => resolve());
            })
          ;
        } else {
          this.setState({
            currentProfile: null,
            currentUser: null,
            isUserLoaded: true,
          }, () => resolve());
        }
      });
    });
    // set current route
    this.updateRoute();
  }

  updateRoute() {
    this.initPromise.then(() => this._updateRoute());
  }

  _updateRoute() {
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
    //  #/edit
    //
    // USER
    //  #/<urlId>/all
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

    else if (constants.views.ROOT[parts[1]]) {
      // HASH = #/<rootView>
      // first part is a root view name, load it
      if (constants.views.ROOT_AUTH[parts[1]] && !this.state.currentUser) {
        // view requires authentication, re-route to accounts page
        return window.location.replace('#/account');
      } else {
        // good to go
        return this.setState({
          isRouteLoaded: true,
          viewName: parts[1],
          viewQuoteId: null,
          viewUrlId: null,
          viewUserId: null,
        });
      }
    }

    else if (constants.views.USER[parts[1]]) {
      // HASH = #/<userView>
      // first part is a user view, reload with user urlId
      const profile = this.state.currentProfile;
      if (profile && profile.urlId) {
        // user is authenticated, use their own urlId
        return window.location.replace(
          '#/' + profile.urlId + hash.slice(1)
        );
      } else {
        // use default user urlId
        return window.location.replace(
          '#/default' + hash.slice(1)
        );
      }
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
        else if (parts[2] && constants.views.ROOT[parts[2]]) {
          // HASH = #/<urlId>/<rootView>
          // good user, but second part is root view, reload without urlId
          return window.location.replace('#/' + parts[2]);
        }
        else if (parts[2] && !constants.views.USER[parts[2]]) {
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

  render() {
    if (!this.state.isRouteLoaded || !this.state.isUserLoaded) {
      return <Loading />
    }

    switch (this.state.viewName) {
      case 'account':
        document.title = 'Account — quote.garden';
        return <Account currentUser={this.state.currentUser} />;

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
        return <All
          currentUser={this.state.currentUser}
          viewUserId={this.state.viewUserId}
        />;

      case 'edit':
        document.title = `Edit — ${this.state.viewUrlId} — quote.garden`;
        return <Edit
          currentUser={this.state.currentUser}
          viewUserId={this.state.viewUserId}
        />;

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
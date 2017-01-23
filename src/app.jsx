import 'babel-polyfill'; // only in code tree root

import React from 'react';
import ReactDOM from 'react-dom';

import fireapp from 'shared/fireapp.jsx';
import * as constants from 'shared/constants.jsx';
import * as queries from 'shared/queries.jsx';

import Account from 'account/account.jsx';
import All from 'all/all.jsx';
import Edit from 'edit/edit.jsx';
import Images from 'shared/images.jsx';
import Loading from 'shared/loading.jsx';
import NavBar from 'shared/nav-bar.jsx';
import Shuffle from 'shuffle/shuffle.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
      profile: null,
      isRouteLoaded: false,
      isUserLoaded: false,
      routeView: null,
      routeQuoteId: null,
      routeUrlId: null,
      routeUserId: null,
    };
  }

  componentDidMount() {
    // preload images
    Images.preload();
    // add event listeners
    window.addEventListener('hashchange', () => this.updateRoute());
    this.initPromise = new Promise((resolve) => {
      const cache = {
        userId: null,
        profileRef: null,
        profileCb: null,
      };
      fireapp.auth().onAuthStateChanged((user) => {
        if (user && user.uid !== cache.userId) {
          cache.userId = user.uid;
          if (cache.profileRef) cache.profileRef.off('value', cache.profileCb);
          cache.profileRef = fireapp.database().ref('profiles/' + user.uid);
          cache.profileCb = cache.profileRef.on('value', (snapshot) => {
            this.setState({
              user: user,
              profile: snapshot ? snapshot.val() : null,
              isUserLoaded: true,
            }, () => resolve());
          });
        } else if (!user) {
          cache.userId = null;
          if (cache.profileRef) cache.profileRef.off('value', cache.profileCb);
          cache.profileRef = null;
          cache.profileCb = null;
          this.setState({
            user: null,
            profile: null,
            isUserLoaded: true,
          }, () => resolve());
        }
      });
    });
    // set current route
    this.updateRoute();
  }

  updateRoute() {
    this.initPromise.then(() => {
      this.setState({isRouteLoaded: false}, () => {
        this._updateRoute();
      });
    });
  }

  _updateRoute() {
    const href = window.location.href;
    const hash = window.location.hash;
    const parts = hash.split('/');

    //
    // route views:
    //
    // SILENT
    //  #/<404> (shows current/failed path)
    //
    // ROOT
    //  #/account
    //  #/edit
    //
    // USER
    //  #/<urlId>/all
    //  #/<urlId>/shuffle/<quoteId>
    //

    //
    // redirects:
    //                        >>>  #/default
    //  #                     >>>  #/default
    //  #/                    >>>  #/default
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
      // empty-ish hash, reload with user or default
      if (this.state.profile && this.state.profile.urlId) {
        return window.location.replace('#/' + this.state.profile.urlId);
      } else {
        return window.location.replace('#/default');
      }
    }

    else if (parts[0] !== '#') {
      // HASH = #thing
      // malformed hash, reload with first / inserted
      return window.location.replace('#/' + hash.slice(1));
    }

    else if (!parts[parts.length - 1].length) {
      // HASH = #/thing/
      // trailing slash, reload with it stripped out
      return window.location.replace(hash.slice(0, -1));
    }

    else if (parts[1] === 'logout') {
      // HASH = #/logout
      // logout user and reload with #/account
      fireapp.auth().signOut();
      return window.location.replace('#/account');
    }

    else if (constants.views.ROOT[parts[1]]) {
      // HASH = #/<rootView>
      // first part is a root view name, load it
      return this.setState({
        isRouteLoaded: true,
        routeView: parts[1],
        routeQuoteId: null,
      });
    }

    else if (constants.views.USER[parts[1]]) {
      // HASH = #/<userView>
      // first part is a user view, reload with user urlId
      if (this.state.profile && this.state.profile.urlId) {
        // user is authenticated, use their own urlId
        return window.location.replace(
          '#/' + this.state.profile.urlId + hash.slice(1)
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
            routeView: '404',
            routeQuoteId: null,
            routeUrlId: null,
            routeUserId: null,
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
            routeView: '404',
            routeQuoteId: null,
            routeUrlId: parts[1],
            routeUserId: userId,
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
            routeView: parts[2],
            routeQuoteId: parts[3] || null,
            routeUrlId: parts[1],
            routeUserId: userId,
          });
        }
      });
    }
  }

  render() {


    // TODO
    // - always include nav bar
    // - abstract out route object:
    //    - route.viewName
    //    - route.displayName
    //    - route.data (userId, publicId, quoteId)


    if (!this.state.isRouteLoaded || !this.state.isUserLoaded) {
      document.title = 'Loading... — quote.garden';
      document.body.className = 'loading';
      return <Loading />;
    }

    if (!this.state.user && constants.views.ROOT_AUTH[this.state.routeView]) {
      // unauthed, & view requires authentication, reload with #/account
      window.location.replace('#/account');
      document.title = 'Loading... — quote.garden';
      document.body.className = 'loading';
      return <Loading />;
    }

    document.body.className = this.state.routeView;
    switch (this.state.routeView) {
      case 'account':
        document.title = 'Account — quote.garden';
        return (
          <div>
            <Account user={this.state.user} />
            <NavBar
              isAuthenticated={Boolean(this.state.user)}
              urlId={this.state.profile && this.state.profile.urlId}
              view={this.state.routeView}
            />
          </div>
        );

      case 'edit':
        document.title = 'Edit — quote.garden';
        return (
          <div>
            <Edit user={this.state.user} />
            <NavBar
              isAuthenticated={Boolean(this.state.user)}
              urlId={this.state.profile.urlId}
              view={this.state.routeView}
            />
          </div>
        );

      case 'all':
        document.title = `All — ${this.state.routeUrlId} — quote.garden`;
        return (
          <div>
            <All userId={this.state.routeUserId} />
            <NavBar
              isAuthenticated={Boolean(this.state.user)}
              urlId={this.state.routeUrlId}
              view={this.state.routeView}
            />
          </div>
        );

      case 'shuffle':
        document.title = `Shuffle — ${this.state.routeUrlId} — quote.garden`;
        return (
          <div>
            <Shuffle
              quoteId={this.state.routeQuoteId}
              userId={this.state.routeUserId}
            />
            <NavBar
              isAuthenticated={Boolean(this.state.user)}
              urlId={this.state.routeUrlId}
              view={this.state.routeView}
            />
          </div>
        );

      case '404':
        document.title = '404 — quote.garden';
        return (
          <div>
            <div>{this.state.routeView}</div>
            <NavBar
              isAuthenticated={Boolean(this.state.user)}
              urlId={this.state.routeUrlId}
            />
          </div>
        );
    }
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
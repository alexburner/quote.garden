// only in code tree root
import 'babel-polyfill';

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
      currentUser: fireapp.auth().currentUser,
      isLoaded: false,
      viewName: null,
      viewUserId: null,
      viewQuoteId: null,
    };
    this.unsubscribes = [];
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
        isLoaded: true,
        viewName: parts[1],
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
            isLoaded: true,
            viewName: '404',
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
            isLoaded: true,
            viewName: '404',
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
      case 'account': return <Account user={this.props.currentUser} />;
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
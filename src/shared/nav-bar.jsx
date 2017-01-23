import React from 'react';

import fireapp from 'shared/fireapp.jsx';

export const getNavItems = (isAuthenticated, urlId) => {
  urlId = urlId ? urlId + '/' : '';
  return isAuthenticated ?
      [
        {
          key: 'shuffle',
          url: urlId + 'shuffle',
          txt: 'Shuffle',
        },
        {
          key: 'all',
          url: urlId + 'all',
          txt: 'All',
        },
        {
          key: 'edit',
          url: 'edit',
          txt: 'Edit',
        },
        {
          key: 'account',
          url: 'account',
          txt: 'Account',
        },
        {
          key: 'logout',
          url: 'logout',
          txt: 'Logout',
        },
      ] :
      [
        {
          key: 'shuffle',
          url: urlId + 'shuffle',
          txt: 'Shuffle',
        },
        {
          key: 'all',
          url: urlId + 'all',
          txt: 'All',
        },
        {
          key: 'account',
          url: 'account',
          txt: 'Login/Register',
        },
      ]
    ;
};

export default class NavBar extends React.Component {
  render() {
    const items = getNavItems(
      this.props.isAuthenticated,
      this.props.urlId
    );
    return (
      <div className="nav-bar">
        <div className="pull-left hidden-xs">
          <a className="btn" href="#/">quote.garden</a>
          {this.props.urlId &&
            <button
              className="btn"
              style={{marginLeft: '-20px'}}
              disabled
            >&mdash; {this.props.urlId}</button>
          }
        </div>
        <div className="pull-right">
          {items.map((item) => (
            item.key === this.props.view ?
              <button
                key={item.key}
                className="btn"
                disabled
              >{item.txt}</button> :
              <a
                key={item.key}
                className="btn"
                href={'#/' + item.url}
              >{item.txt}</a>
          ))}
        </div>
      </div>
    );
  }
};
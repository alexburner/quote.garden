import React from 'react';

import fireapp from 'shared/fireapp.jsx';

export default class NavBar extends React.Component {
  render() {
    const urlId = this.props.urlId || '';
    const items = this.props.user ?
      [
        {
          key: 'shuffle',
          url: urlId ? urlId + '/shuffle' : 'shuffle',
          txt: 'Shuffle',
        },
        {
          key: 'all',
          url: urlId ? urlId + '/all' : 'all',
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
          url: urlId ? urlId + '/shuffle' : 'shuffle',
          txt: 'Shuffle',
        },
        {
          key: 'all',
          url: urlId ? urlId + '/all' : 'all',
          txt: 'All',
        },
        {
          key: 'account',
          url: 'account',
          txt: 'Login/Register',
        },
      ]
    ;

    return (
      <div className="nav-bar">
        <div className="pull-left hidden-xs">
          <a className="btn" href="#/home">quote.garden</a>
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
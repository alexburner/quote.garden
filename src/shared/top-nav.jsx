import React from 'react';

import fireapp from 'shared/fireapp.jsx';

export default class TopNav extends React.Component {
  render() {
    const view = this.props.viewName;
    const tuples = this.props.currentUser ?
      [
        ['shuffle', 'Shuffle'],
        ['all', 'All'],
        ['edit', 'Edit'],
        ['account', 'Account'],
      ] :
      [
        ['account', 'Login / Register'],
      ]
    ;
    return (
      <div className="top-nav">
        {tuples.map((tuple) => (
          tuple[0] === view ?
            <button
              key={tuple[1]}
              className="btn btn-empty"
              disabled
            >{tuple[1]}</button> :
            <a
              key={tuple[1]}
              className="btn btn-empty"
              href={'#/' + tuple[0]}
            >{tuple[1]}</a>
        ))}
      </div>
    );
  }
};
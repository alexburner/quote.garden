import React from 'react';

export default class Loading extends React.Component {
  render() {
    return (
      <div className="text-center">
        <p>&nbsp;</p>
        <i className="fa fa-refresh fa-spin fa-3x"></i>
      </div>
    );
  }
};
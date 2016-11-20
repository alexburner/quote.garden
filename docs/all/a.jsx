import React from 'react';
import ReactDOM from 'react-dom';

class A extends React.Component {
  render() {
    return <h1>A</h1>
  }
}

ReactDOM.render(<A/>, document.getElementById('a'));
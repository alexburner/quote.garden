import React from 'react';
import ReactDOM from 'react-dom';

class B extends React.Component {
  render() {
    return <h1>B</h1>
  }
}

ReactDOM.render(<B/>, document.getElementById('b'));
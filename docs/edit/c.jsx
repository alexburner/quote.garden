import React from 'react';
import ReactDOM from 'react-dom';

class C extends React.Component {
  render() {

    console.log('test?');
    console.log('test!');

    // chees = cheese;

    return <h1>C</h1>;
  }
}

ReactDOM.render(<C/>, document.getElementById('c'));
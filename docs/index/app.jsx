import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return (
        <div>
            <h1>Hello index app</h1>
            <ul>
                {['all', 'edit', 'random'].map(name => (
                    <li><a href={name}>{name}</a></li>
                ))}
            </ul>
        </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
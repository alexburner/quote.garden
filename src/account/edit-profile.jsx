import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import TopNav from 'shared/top-nav.jsx';

export default class EditProfile extends React.Component {
  constructor() {
    super();
    const user = fireapp.auth().currentUser;
    this.state = {
      user: user,
      newDisplayName: user.displayName || '',
    };
    this.unsubscribes = [];
  }

  componentDidMount() {
    this.unsubscribes.push(
      fireapp.auth().onAuthStateChanged((user) => {

        console.log('componentDidMount', user.displayName);

        this.setState({
          user: user,
          newDisplayName: user.displayName || '',
        });
      })
    );
  }

  componentWillUnmount() {
    this.unsubscribes.forEach((fn) => fn());
  }

  render() {

    console.log('render', this.state.newDisplayName);

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row form-group">
          <div className="col col-sm-3">
            <label className="label-inline" htmlFor="new_display_name">
              Update URL ID:
            </label>
          </div>
          <div className="col col-sm-9">
            <input
              id="new_display_name"
              type="text"
              value={this.state.newDisplayName}
            />
            <div className="text-small text-wrap">
              <span className="text-muted">
                http://quote.garden/random/#u=
              </span>
              {this.state.newDisplayName}
            </div>
          </div>
        </div>
        <div className="form-group text-right">
          <input
            className="btn"
            type="submit"
            value="Save Changes"
          />
        </div>
      </form>
    );
  }
}
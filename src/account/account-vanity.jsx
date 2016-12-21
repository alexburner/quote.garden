import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import TopNav from 'shared/top-nav.jsx';

export default class Account extends React.Component {
  constructor() {
    super();
    const user = fireapp.auth().currentUser;
    this.state = {
      user: user,
      new_url_id: '',
    };
    this.unsubscribes = [];
  }

  componentDidMount() {
    this.unsubscribes.push(
      fireapp.auth().onAuthStateChanged((user) => {
        this.setState({user: user});
      })
    );
  }

  componentWillUnmount() {
    this.unsubscribes.forEach((fn) => fn());
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row form-group">
          <div className="col col-sm-3">
            <label className="label-inline" htmlFor="new_url_id">
              Update URL ID:
            </label>
          </div>
          <div className="col col-sm-9">
            <input
              id="new_url_id"
              type="text"
              value={this.state.new_url_id}
            />
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
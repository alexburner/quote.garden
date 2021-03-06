import React from 'react';

import fireapp from 'shared/fireapp.jsx';
import * as queries from 'shared/queries.jsx';

import Loading from 'shared/loading.jsx';

export default class EditUrl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      isSubmitting: false,
      statusMessage: '',
      urlId: '',
      newUrlId: '',
    };
    this.handleProfile = (snapshot) => {
      if (!snapshot || !snapshot.val()) {
        this.setState({
          isFetching: false,
          newUrlId: null,
          urlId: null,
        });
        return;
      }
      const profile = snapshot.val();
      this.setState({
        isFetching: false,
        newUrlId: profile.urlId,
        urlId: profile.urlId,
      });
    };
    this.handleUrlId = (event) => this.setState({newUrlId: event.target.value});
    this.handleSubmit = (event) => {
      event.preventDefault();

      const oldUrlId = this.state.urlId;
      const newUrlId = this.state.newUrlId.trim();

      if (newUrlId === oldUrlId) {
        alert('No changes to save.');
        return;
      }

      if (!newUrlId) {
        alert('Error: URL name must have some value.');
        this.setState({newUrlId: this.state.urlId});
        return;
      }

      if ((/[^0-9a-z\+\-\_\.]+/ig).test(newUrlId)) {
        alert('Error: URL name can only contain alphanumeric + - _ .');
        this.setState({newUrlId: this.state.urlId});
        return;
      }

      this.setState({
        newUrlId: newUrlId,
        isSubmitting: true,
        statusMessage: '',
      });

      queries.getUserIdByUrlId(newUrlId).then((userId) => {
        if (userId) {
          alert('Sorry, that URL name is already in use.');
          this.setState({
            newUrlId: this.state.urlId,
            isSubmitting: false
          });
          return;
        }
        this.profileRef.update({urlId: newUrlId})
          .then(() => {
            this.setState({statusMessage: 'Changes saved!'});
            setTimeout(() => this.setState({statusMessage: ''}), 1500);
          })
          .catch(err => alert(err.message))
          .then(() => this.setState({isSubmitting: false}))
        ;
      });
    };
  }

  setupFirebase(userId) {
    this.profileRef = fireapp.database().ref('profiles/' + userId);
    this.profileRef.on('value', this.handleProfile);
  }

  teardownFirebase() {
    this.profileRef.off('value', this.handleProfile);
  }

  componentDidMount() {
    this.setupFirebase(this.props.user.uid);
  }

  componentWillUnmount() {
    this.teardownFirebase();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user.uid !== nextProps.user.uid) {
      this.teardownFirebase();
      this.setupFirebase(nextProps.user.uid);
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.state.isFetching ?
          <Loading noPadding="true" /> :
          <div className="row form-group">
            <div className="col col-sm-3">
              <label className="label-inline" htmlFor="new_url_id">
                Update URL name:
              </label>
            </div>
            <div className="col col-sm-9">
              <input
                id="new_url_id"
                type="text"
                value={this.state.newUrlId}
                onChange={this.handleUrlId}
              />
              <div className="text-small text-wrap">
                <span className="text-muted">
                  http://quote.garden/#/
                </span>
                {this.state.newUrlId}
              </div>
            </div>
          </div>
        }
        <div className="form-group text-right">
          <span className="text-small text-muted">
            {this.state.statusMessage}
          </span>
          {
            this.state.isSubmitting &&
            <i className="fa fa-refresh fa-spin"></i>
          }
          <input
            className="btn"
            type="submit"
            value="Save Changes"
            disabled={
              this.state.isSubmitting ||
              !(this.state.newUrlId && this.state.newUrlId.length ) ||
              this.state.newUrlId.trim() === this.state.urlId
            }
          />
        </div>
      </form>
    );
  }
}
import React from 'react';

import fireapp from 'shared/fireapp.jsx';
import * as queries from 'shared/queries.jsx';
import * as util from 'shared/util.jsx';

import Loading from 'shared/loading.jsx';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: [],
    };
    this.imageUrl = '';
    this.imageUrls = [
      'http://i.imgur.com/OyT0PvY.jpg',
      'http://i.imgur.com/ifGsGZR.jpg',
      'http://i.imgur.com/2wctpuH.jpg',
      'http://i.imgur.com/uOjNgdA.jpg',
      'http://i.imgur.com/HqHiwb9.jpg',
      'http://i.imgur.com/eST3506.jpg',
      'http://i.imgur.com/MrKfkwN.jpg',
      'http://i.imgur.com/5GWLv0c.jpg',
      'http://i.imgur.com/EvW3H0d.jpg',
      'http://i.imgur.com/k3AgEO8.jpg',
      'http://i.imgur.com/v5kFKUE.jpg',
      'http://i.imgur.com/1CdU2JX.jpg',
      'http://i.imgur.com/owyWGdo.jpg',
      'http://i.imgur.com/BcqItX6.jpg',
      'http://i.imgur.com/2k23gWp.jpg'
    ];
  }

  componentWillMount() {
    this.imageStyle = {
      backgroundImage: `url(${util.getRandomElement(this.imageUrls)})`,
    };
  }

  componentDidMount() {
    queries.getDefaultUserId().then((userId) => {
      fireapp.database().ref('quotes/' + userId).once('value', (snapshot) => {
        const quotes = [];
        if (snapshot && snapshot.val()) {
          snapshot.forEach((snapshot) => {
            const quote = snapshot.val();
            quote.key = snapshot.key;
            quotes.unshift(quote);
          });
        }
        this.setState({
          quote: util.getRandomElement(quotes),
        });
      });
    });
  }

  render() {
    return (
      <div className="slide" style={this.imageStyle}>
        {this.state.quote &&
          <div className="quote">
            <div className="quote-back">
              <div className="quote-wrap">
                <h2 className="words">
                  <span className="bar">
                    {this.state.quote.words}
                  </span>
                </h2>
                <h4 className="source">
                  <span className="bar">
                    {this.state.quote.source}
                  </span>
                </h4>
              </div>
              <div className="quote-fore">
                <div className="quote-wrap">
                  <h2 className="words">
                    <span className="bar">
                      {this.state.quote.words}
                    </span>
                  </h2>
                  <h4 className="source">
                    <span className="bar">
                      {this.state.quote.source}
                    </span>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}
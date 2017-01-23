import React from 'react';

export default class Slide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShown: false,
    };
  }

  componentDidMount() {
    this.setState({
      isShown: true,
    });
  }

  render() {
    const className = this.state.isShown ? 'slide fade-in' : 'slide';
    const style = {
      backgroundImage: `url(${this.props.image})`,
      zIndex: this.props.zIndex,
    };
    return (
      <div className={className} style={style}>
        <div className="quote">
          <div className="quote-back">
            <div className="quote-wrap">
              <h2 className="words">
                <span className="bar">
                  {this.props.quote.words}
                </span>
              </h2>
              <h4 className="source">
                <span className="bar">
                  {this.props.quote.source}
                </span>
              </h4>
            </div>
            <div className="quote-fore">
              <div className="quote-wrap">
                <h2 className="words">
                  <span className="bar">
                    {this.props.quote.words}
                  </span>
                </h2>
                <h4 className="source">
                  <span className="bar">
                    {this.props.quote.source}
                  </span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
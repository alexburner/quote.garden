import React from 'react';

import fireapp from 'shared/fireapp.jsx';
import * as queries from 'shared/queries.jsx';
import * as util from 'shared/util.jsx';

import Images from 'shared/images.jsx';
import Loading from 'shared/loading.jsx';
import Slide from 'shuffle/slide.jsx';

export default class Shuffle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      quotes: null,
      slides: null,
    };
    this.images = new Images();
    this.quoteIndex = null;
    this.slideCount = null;
    this.handleQuotes = (snapshot) => {
      this.quoteIndex = 0;
      this.slideCount = 0;
      const quotes = [];
      const slides = [];
      if (snapshot && snapshot.val()) {
        snapshot.forEach((snapshot) => {
          const quote = snapshot.val();
          quote.key = snapshot.key;
          quotes.unshift(quote);
        });
        if (quotes.length) {
          util.shuffle(quotes);
          slides.push(this.makeSlide(quotes[this.quoteIndex]));
        }
      }
      this.setState({
        isLoaded: true,
        quotes: quotes,
        slides: slides,
      });
    };
    this.handleKeydown = (e) => {
      switch (e.which) {
        case 37:
          // left arrow key
          e.preventDefault();
          this.showPrevQuote();
          break;
        case 39:
          // right arrow key
          e.preventDefault();
          this.showNextQuote();
          break;
      }
    };
  }

  makeSlide(quote) {
    this.slideCount++;
    return {
      image: this.images.getRandom(),
      key: this.slideCount,
      quote: quote,
    }
  }

  showNewSlide(quote) {
    this.setState((state) => ({
      // immediately add new slide to end of array
      slides: state.slides.concat(this.makeSlide(quote))
    }), () => setTimeout(() => this.setState((state) => ({
      // after 2s, remove old slide from beginning
      slides: state.slides.slice(1)
    })), 2000));
  }

  showNextQuote() {
    if (!this.hasQuotes()) return;
    this.quoteIndex += 1;
    this.quoteIndex %= this.state.quotes.length;
    this.showNewSlide(this.state.quotes[this.quoteIndex]);
  }

  showPrevQuote() {
    if (!this.hasQuotes()) return;
    this.quoteIndex -= 1;
    this.quoteIndex = this.quoteIndex < 0 ?
      this.state.quotes.length - 1 :
      this.quoteIndex
    ;
    this.showNewSlide(this.state.quotes[this.quoteIndex]);
  }

  hasQuotes() {
    return (
      this.state.isLoaded &&
      this.state.quotes &&
      this.state.quotes.length
    );
  }

  setupFirebase(userId) {
    this.setState({isLoaded: false}, () => {
      this.quotesRef = fireapp.database().ref('quotes/' + userId);
      this.quotesRef.on('value', this.handleQuotes);
    });
  }

  teardownFirebase() {
    this.quotesRef.off('value', this.handleQuotes);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown);
    this.setupFirebase(this.props.userId);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
    this.teardownFirebase();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userId !== nextProps.userId) {
      this.teardownFirebase();
      this.setupFirebase(nextProps.userId);
    }
  }

  render() {
    return !this.state.isLoaded ?
      <Loading /> :
      !this.state.quotes.length ?
        <h1>No quotes yet...</h1> :
        <div className="slides">
          {this.state.slides.map((slide, index) => (
            <Slide
              image={slide.image}
              key={slide.key}
              quote={slide.quote}
              zIndex={index + 1}
            />
          ))}
        </div>
    ;
  }
}
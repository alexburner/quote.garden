const images = [
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

export default class Images {
    constructor() {
        this.index = 0;
    }

    getRandom() {
        let index = Math.floor(Math.random() * images.length);
        if (index === this.index) return this.getRandom(); // re-roll
        this.index = index;
        return images[index];
    }
}
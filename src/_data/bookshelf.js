/**
 * {
 *   title: string;
 *   subtitle?: string;
 *   author: string;
 *   img: string;
 *   url: string;
 *   rating?: 1|1.5|2|2.5|3|3.5|4|4.5|5;
 *   notes?: string;
 *   status: 'reading'|'read'|'will read'
 *   started?: string;
 *   completed?: string;
 * }
 */

const props = [
  'title',
  'subtitle',
  'author',
  'img',
  'url',
  'rating',
  'notes',
  'status',
  'started',
  'completed',
];

class Book {
  constructor(data) {
    const entries = Object.entries(data);
    for (let [key, val] of entries) {
      if (['started', 'completed'].includes(key)) {
        this[key] = new Date(val);
      } else if (props.includes(key)) {
        this[key] = val;
      }
    }
  }

  get status() {
    if (this.completed) {
      return 'read';
    } else if (this.started) {
      return 'reading';
    } else {
      return 'will read';
    }
  }
}

class BookShelf {
  constructor(books) {
    this.books = books;
  }

  get currentlyReading() {
    return this.books.find((book) => book.started);
  }

  get byYear() {
    return this.books
      .filter((book) => book.completed)
      .reduce((byYear, book) => {
        const year = book.completed.getFullYear();
        (byYear[year] = byYear[year] || []).push(book);
        return byYear;
      }, {});
  }
}

module.exports = new BookShelf([
  new Book({
    title: 'Demystifying Public Speaking',
    author: 'Lara Hogan',
    img:
      'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1477492185l/32784222.jpg',
    url: 'https://abookapart.com/products/demystifying-public-speaking',
    rating: null,
    notes: null,
  }),
  new Book({
    title: 'Deep JavaScript',
    subtitle: 'Theory and Techniques',
    author: 'Dr. Axel Rauschmayer',
    img: 'https://exploringjs.com/deep-js/img-homepage/cover-homepage.jpg',
    url: 'https://exploringjs.com/deep-js/',
    rating: null,
    notes: null,
  }),
  new Book({
    title: 'Dive into Design Patterns',
    author: 'Alexander Shvets',
    img:
      'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1543945452i/43125355._UY2500_SS2500_.jpg',
    url: 'https://refactoring.guru/design-patterns/book',
    rating: null,
    notes: null,
  }),
  new Book({
    title: 'The Pragmatic Programmer',
    subtitle: 'Your Journey To Mastery, 20th Anniversary Edition (2nd Edition)',
    author: 'David Thomas and Andrew Hunt',
    img:
      'https://images-na.ssl-images-amazon.com/images/P/0135957052.01._SCLZZZZZZZ_.jpg',
    url: 'https://www.amazon.com/David-Thomas/dp/0135957052/',
    rating: null,
    notes: null,
    started: '2020-08-15',
  }),
]);

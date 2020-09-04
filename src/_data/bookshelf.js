/**
 * @typedef {{
 *   title: string;
 *   subtitle?: string;
 *   author: string;
 *   img: string;
 *   url: string;
 *   rating?: 1|2|3|4|5;
 *   notes?: string;
 *   status: 'reading'|'read'|'will read'
 * }} Book
 */

/**
 * @typedef {{
 *   year: number,
 *   books: Book[]
 * }} Bookshelf
 */

/**
 * @type {Bookshelf[]}
 */
module.exports = [
  {
    year: 2020,
    books: [
      {
        title: 'Deep JavaScript',
        subtitle: 'Theory and Techniques',
        author: 'Dr. Axel Rauschmayer',
        img: 'https://exploringjs.com/deep-js/img-homepage/cover-homepage.jpg',
        url: 'https://exploringjs.com/deep-js/',
        rating: null,
        notes: null,
        status: 'will read',
      },
      {
        title: 'Dive into Design Patterns',
        author: 'Alexander Shvets',
        img:
          'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1543945452i/43125355._UY2500_SS2500_.jpg',
        url: 'https://refactoring.guru/design-patterns/book',
        rating: null,
        notes: null,
        status: 'will read',
      },
      {
        title: 'The Pragmatic Programmer',
        subtitle:
          'Your Journey To Mastery, 20th Anniversary Edition (2nd Edition)',
        author: 'David Thomas and Andrew Hunt',
        img:
          'https://images-na.ssl-images-amazon.com/images/P/0135957052.01._SCLZZZZZZZ_.jpg',
        url: 'https://www.amazon.com/David-Thomas/dp/0135957052/',
        rating: null,
        notes: null,
        status: 'reading',
      },
    ],
  },
];

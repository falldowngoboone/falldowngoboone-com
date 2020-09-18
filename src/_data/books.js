// @ts-check

const [WILL_READ, READING, READ] = [0, 1, 2];

/** @type {WeakMap<object, Book[]>} */
const instanceBooks = new WeakMap();

/**
 * @typedef {{
 *   title: string;
 *   subtitle?: string;
 *   author: string;
 *   img?: string;
 *   url: string;
 *   rating?: 1|1.5|2|2.5|3|3.5|4|4.5|5;
 *   notes?: string;
 *   started?: Date|string;
 *   completed?: Date|string;
 * }} BookDef
 */

/**
 * @typedef {{
 *   year: number;
 *   books: Book[]
 * }} Shelf
 */

class Book {
  constructor(
    /** @type BookDef */ {
      title,
      subtitle = null,
      author,
      img = '/images/no-cover.svg',
      url,
      rating = null,
      notes = null,
      started = null,
      completed = null,
    }
  ) {
    this.title = title;
    this.subtitle = subtitle;
    this.author = author;
    this.img = img;
    this.url = url;
    this.rating = rating;
    this.notes = notes;
    this.started = 'string' === typeof started ? new Date(started) : started;
    this.completed =
      'string' === typeof completed ? new Date(completed) : completed;
  }

  static from(/** @type {BookDef} */ def) {
    return new Book(def);
  }

  static compare(/** @type {any} */ a, /** @type {any} */ b) {
    if (!(a instanceof Book) || !(b instanceof Book)) {
      throw new Error(
        `Compare argument must be a Book. Recieved: ( ${a}, ${b} )`
      );
    }

    // move all unstarted and uncompleted books to the front
    if (WILL_READ === a.status) {
      return -1;
    } else if (WILL_READ === b.status) {
      return 1;
    } else if (READING === a.status) {
      return -1;
    } else if (READING === b.status) {
      return 1;
    }

    return b.completed.valueOf() - a.completed.valueOf(); // ascending;
  }

  get status() {
    if (this.completed) {
      return READ;
    } else if (this.started) {
      return READING;
    } else {
      return WILL_READ;
    }
  }
}

class Books {
  constructor(/** @type Book[] */ books) {
    instanceBooks.set(
      this,
      books.sort((a, b) => Book.compare(a, b))
    );
  }

  static from(/** @type {BookDef[]} */ defs = []) {
    return new Books(defs.map(Book.from));
  }

  get all() {
    return instanceBooks.get(this);
  }

  get toRead() {
    return this.all.filter((book) => WILL_READ === book.status);
  }

  get reading() {
    return this.all.filter((book) => READING === book.status);
  }

  get completed() {
    return this.all.filter((book) => READ === book.status);
  }

  get byYear() {
    return this.completed.reduce((/** @type Shelf[] */ shelves, book) => {
      const yearCompleted = book.completed.getFullYear();
      let yearObj = shelves.find((shelf) => shelf.year === yearCompleted);
      if (!yearObj) {
        yearObj = { year: yearCompleted, books: [] };
        shelves.push(yearObj);
      }
      yearObj.books.push(book);
      return shelves;
    }, []);
  }
}

module.exports = Books.from([
  {
    title: 'Tackling TypeScript',
    subtitle: 'Upgrading from JavaScript',
    author: 'Dr.Axel Rauschmayer',
    url: 'https://exploringjs.com/tackling-ts/',
  },
  {
    title: 'Demystifying Public Speaking',
    author: 'Lara Hogan',
    img:
      'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1477492185l/32784222.jpg',
    url: 'https://abookapart.com/products/demystifying-public-speaking',
  },
  {
    title: 'Deep JavaScript',
    subtitle: 'Theory and Techniques',
    author: 'Dr. Axel Rauschmayer',
    img: 'https://exploringjs.com/deep-js/img-homepage/cover-homepage.jpg',
    url: 'https://exploringjs.com/deep-js/',
  },
  {
    title: 'Dive into Design Patterns',
    author: 'Alexander Shvets',
    img:
      'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1543945452i/43125355._UY2500_SS2500_.jpg',
    url: 'https://refactoring.guru/design-patterns/book',
  },
  {
    title: 'The Pragmatic Programmer',
    subtitle: 'Your Journey To Mastery, 20th Anniversary Edition (2nd Edition)',
    author: 'David Thomas and Andrew Hunt',
    img:
      'https://images-na.ssl-images-amazon.com/images/P/0135957052.01._SCLZZZZZZZ_.jpg',
    url: 'https://www.amazon.com/David-Thomas/dp/0135957052/',
    started: '2020-08-15',
  },
]);

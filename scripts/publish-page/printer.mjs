// the page is represented as an array
// we write to the page by pushing content to the array, including padding and line returns
// the page is printed by joining the array
// TODO: represent page as a Buffer?

const NEW_LINE = '\n';
const SPACES = 4;

class Printer {
  #writers;
  #opts;
  #indentLevel = 0;
  #page = [];

  constructor(writers, opts) {
    this.#writers = writers;
    this.#opts = opts;
  }

  #writeProperties(properties) {
    const { frontMatter } = this.#opts;
    this.#writeLine(frontMatter(properties));
  }

  #writeContent(block, parent = null, index = 0, blocks = []) {
    if (!block) return;

    if (Array.isArray(block)) {
      return block.forEach((child, i) =>
        this.#writeContent(child, parent, i, block)
      );
    }

    const writer = this.#writers[block.type];

    writer?.({
      block,
      parent,
      index,
      blocks,
      writeLine: this.#writeLine.bind(this),

      // convenience fields
      isFirst: index === 0,
      isLast: index === blocks.length - 1,
      prev: blocks[index - 1] || null,
      next: blocks[index + 1] || null,
      getConfig({ type, [type]: config }) {
        return config;
      },
    });

    if (block.has_children) {
      this.#indent();
      this.#writeContent(block.children, block, index, blocks);
      this.#dedent();
    }
  }

  #writeLine(content = '') {
    this.#page.push(''.padStart(this.#indentLevel * SPACES));
    this.#page.push(content);
    this.#page.push(NEW_LINE);
  }

  #indent() {
    this.#indentLevel++;
  }

  #dedent() {
    this.#indentLevel--;
  }

  #printPage() {
    return this.#page.join('');
  }

  print({ frontMatter, content }) {
    this.#writeProperties(frontMatter);
    this.#writeContent(content);
    return this.#printPage();
  }
}

function getPrinter(writers, opts = {}) {
  return new Printer(writers, opts);
}

export { getPrinter };

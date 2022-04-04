// the page is represented as an array
// we write to the page by pushing content to the array, including padding and line returns
// the page is printed by joining the array
// TODO: represent page as a Buffer?

const FRONT_MATTER_SEPARATOR = '---';
const NEW_LINE = '\n';

class Printer {
  #writers;
  #indentLevel = 0;
  #page = [];

  constructor(writers) {
    this.#writers = writers;
  }

  // TODO: move out of here? Or don't rely on formatters?
  #writeProperties(properties) {
    const writer = this.#writers.properties;
    const propertyLines = writer?.(properties) || [];

    this.#writeLine(FRONT_MATTER_SEPARATOR);
    propertyLines.forEach((line) => {
      if (Array.isArray(line)) {
        const [first, ...rest] = line;
        this.#writeLine(first);
        this.#indent();
        rest.forEach((l) => this.#writeLine(l));
        this.#dedent();
      } else {
        this.#writeLine(line);
      }
    });
    this.#writeLine(FRONT_MATTER_SEPARATOR);
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
    // TODO: dynamic spacing config?
    this.#page.push(''.padStart(this.#indentLevel * 4));
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

function getPrinter(writers) {
  return new Printer(writers);
}

export { getPrinter };

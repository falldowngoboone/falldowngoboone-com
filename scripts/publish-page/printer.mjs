// the page is represented as an array
// we write to the page by pushing content to the array, including padding and line returns
// the page is printed by joining the array
// TODO: represent page as a Buffer?

const SEPARATOR = '---';
const NEW_LINE = '\n';

class Printer {
  #printMap;
  #indentLevel = 0;
  #page = [];

  constructor(printMap) {
    this.#printMap = printMap;
  }

  // TODO: move out of here? Or don't rely on formatters?
  #writeProperties(properties) {
    const writer = this.#printMap.properties;
    const propertyLines = writer?.(properties) || [];

    this.#writeLine(SEPARATOR);
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
    this.#writeLine(SEPARATOR);
  }

  #writeContent(block, parent = null, index = 0, blocks = []) {
    if (!block) return;

    if (Array.isArray(block)) {
      return block.forEach((child, i) =>
        this.#writeContent(child, parent, i, block)
      );
    }

    const { type, [type]: config } = block;
    const writer = this.#printMap[type];

    // ! Intimate knowledge of Markdown formatting
    if (
      !type.includes('list_item') ||
      (index !== 0 && !blocks[index - 1].type.includes('list_item'))
    ) {
      this.#writeLine();
    }

    // can be a string or an array of strings (e.g. code)...is this good?
    // I think writing should be delgated to the writers themselves? Is that too much power?
    const line = writer
      ? writer(config)
      : `${type} not supported by this formatter.`;

    if (Array.isArray(line)) {
      line.forEach((l) => {
        this.#writeLine(l);
      });
    } else {
      this.#writeLine(line);
    }

    if (!type.includes('list_item') && index === blocks.length - 1) {
      this.#writeLine();
    }

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

function getPrinter(printMap) {
  return new Printer(printMap);
}

export { getPrinter };

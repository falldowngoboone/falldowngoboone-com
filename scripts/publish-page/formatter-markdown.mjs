const formatters = {
  properties({ title, date, excerpt, tags }) {
    return [
      `title: "${title.title.map(({ plain_text }) => plain_text).join('')}"`,
      `date: ${date.date?.start || today()}`,
      `excerpt: ${formatRichText(excerpt.rich_text)}`,
      ['tags:', ...tags.multi_select.map(({ name }) => `- ${name}`)],
    ];
  },
  paragraph({ block, writeLine, isLast, getConfig }) {
    const { rich_text } = getConfig(block);

    writeLine('');
    writeLine(formatRichText(rich_text));
    isLast && writeLine('');
  },
  heading_1({ block, writeLine, isLast, getConfig }) {
    const { rich_text } = getConfig(block);

    writeLine('');
    writeLine(`# ${formatRichText(rich_text)}`);
    isLast && writeLine('');
  },
  heading_2({ block, writeLine, isLast, getConfig }) {
    const { rich_text } = getConfig(block);

    writeLine('');
    writeLine(`## ${formatRichText(rich_text)}`);
    isLast && writeLine('');
  },
  heading_3({ block, writeLine, isLast, getConfig }) {
    const { rich_text } = getConfig(block);

    writeLine('');
    writeLine(`### ${formatRichText(rich_text)}`);
    isLast && writeLine('');
  },
  bulleted_list_item({ block, prev, writeLine, getConfig }) {
    const { rich_text } = getConfig(block);

    if (prev && !prev.type.includes('list_item')) {
      writeLine('');
    }

    writeLine(`- ${formatRichText(rich_text)}`);
  },
  numbered_list_item({ block, prev, writeLine, getConfig }) {
    const { rich_text } = getConfig(block);

    if (prev && !prev.type.includes('list_item')) {
      writeLine('');
    }

    writeLine(`1. ${formatRichText(rich_text)}`);
  },
  code({ block, writeLine, isLast, getConfig }) {
    const { rich_text, language } = getConfig(block);

    writeLine('');
    writeLine('```' + language);
    writeLine(formatRichText(rich_text));
    writeLine('```');
    isLast && writeLine('');
  },
  image({ block, writeLine, isLast, getConfig }) {
    const { caption, type, [type]: config } = getConfig(block);

    writeLine('');
    writeLine(`![${formatRichText(caption)}](${config.url})`);
    isLast && writeLine('');
  },
  // TODO: support multiple types of callouts
  callout({ block, writeLine, isLast, getConfig }) {
    const { rich_text } = getConfig(block);

    writeLine('');
    writeLine('<aside>');
    writeLine(formatRichText(rich_text));
    writeLine('</aside>');
    isLast && writeLine('');
  },
  quote({ block, writeLine, isLast, getConfig }) {
    const { rich_text } = getConfig(block);

    writeLine('');
    writeLine(`> ${formatRichText(rich_text)}`);
    isLast && writeLine('');
  },
};

function formatRichText(array = []) {
  // apply in reverse order
  // bold, italic, strikethrough, underline, code, then link

  return array
    .map(({ type, [type]: config, annotations }, i, arr) => {
      if (type !== 'text') return ''; // TODO: support `mention` and `equation`

      const { content, link } = config;
      const prevSibling = array[i - 1];
      const nextSibling = array[i + 1];

      let formatted = content;

      if (annotations.code) {
        if (!prevSibling?.annotations.code) formatted = '`' + formatted;
        if (!nextSibling?.annotations.code) formatted = formatted + '`';
      }
      if (annotations.underline) {
        // no-op for now
      }
      if (annotations.strikethrough) {
        if (!prevSibling?.annotations.strikethrough)
          formatted = '~~' + formatted;
        if (!nextSibling?.annotations.strikethrough)
          formatted = formatted + '~~';
      }
      if (annotations.italic) {
        if (!prevSibling?.annotations.italic) formatted = '*' + formatted;
        if (!nextSibling?.annotations.italic) formatted = formatted + '*';
      }
      if (annotations.bold) {
        if (!prevSibling?.annotations.bold) formatted = '**' + formatted;
        if (!nextSibling?.annotations.bold) formatted = formatted + '**';
      }

      if (link) {
        if (!prevSibling?.href) formatted = '[' + formatted;
        if (!nextSibling?.href) formatted = formatted + `](${link.url})`;
      }

      return formatted;
    })
    .join('');
}

function today() {
  const [date] = new Date().toISOString().split('T');

  return date;
}

export { formatters };

const formatters = {
  properties({ title, date, excerpt, tags }) {
    return [
      `title: "${title.title.map(({ plain_text }) => plain_text).join('')}"`,
      `date: ${date.date?.start || today()}`,
      `excerpt: ${formatRichText(excerpt.rich_text)}`,
      ['tags:', ...tags.multi_select.map(({ name }) => `- ${name}`)],
    ];
  },
  paragraph({ rich_text }) {
    return formatRichText(rich_text);
  },
  heading_1({ rich_text }) {
    return `# ${formatRichText(rich_text)}`;
  },
  heading_2({ rich_text }) {
    return `## ${formatRichText(rich_text)}`;
  },
  heading_3({ rich_text }) {
    return `### ${formatRichText(rich_text)}`;
  },
  bulleted_list_item({ rich_text }) {
    return `- ${formatRichText(rich_text)}`;
  },
  numbered_list_item({ rich_text }) {
    return `1. ${formatRichText(rich_text)}`;
  },
  code({ rich_text, language }) {
    return ['```' + language, formatRichText(rich_text), '```'];
  },
  image({ caption, type, [type]: config }) {
    return `![${formatRichText(caption)}](${config.url})`;
  },
  callout({ rich_text }) {
    return ['<aside>', formatRichText(rich_text), '</aside>'];
  },
  quote({ rich_text }) {
    return `> ${formatRichText(rich_text)}`;
  },
};

function formatRichText(array = []) {
  // apply in reverse order
  // bold, italic, strikethrough, underline, code, then link

  return array
    .map(({ type, [type]: config, annotations }, i, arr) => {
      if (type !== 'text') return '';

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

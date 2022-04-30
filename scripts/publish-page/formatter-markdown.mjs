const formatters = {
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
    writeLine('{% aside %}');
    writeLine(formatRichText(rich_text));
    writeLine('{% endaside %}');
    isLast && writeLine('');
  },
  quote({ block, writeLine, isLast, getConfig }) {
    const { rich_text } = getConfig(block);

    writeLine('');
    writeLine(`> ${formatRichText(rich_text)}`);
    isLast && writeLine('');
  },
};

function frontMatter({ title, date, excerpt, tags }) {
  return `---
title: "${title.title.map(({ plain_text }) => plain_text).join('')}"
date: ${date.date?.start || today()}
excerpt: ${formatRichText(excerpt.rich_text)}
tags:
${tags.multi_select.map(({ name }) => `  - ${name}`).join('\n')}
---`;
}

function formatRichText(richTextObjects = []) {
  return richTextObjects
    .map(({ type, [type]: config, annotations }, i) => {
      if (type !== 'text') return ''; // TODO: support `mention` and `equation`

      const prev = richTextObjects[i - 1];
      const next = richTextObjects[i + 1];

      const formatFromConfig = createFormatFactory(
        config,
        prev?.[prev?.type],
        next?.[next?.type]
      );
      const formatFromAnnotations = createFormatFactory(
        annotations,
        prev?.annotations,
        next?.annotations
      );

      const link = formatFromConfig('link', '[', `](${config.link?.url})`);
      const bold = formatFromAnnotations('bold', '**');
      const italic = formatFromAnnotations('italic', '*');
      const strikethrough = formatFromAnnotations('strikethrough', '~~');
      const underline = formatFromAnnotations('underline', ''); // no-op for Markdown
      const code = formatFromAnnotations('code', '`');

      // applied in reverse order
      const formatter = compose(
        link,
        bold,
        italic,
        strikethrough,
        underline,
        code
      );

      return formatter(config.content);
    })
    .join('');
}

function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}

function createFormatFactory(current, prev, next) {
  return (key, startToken, endToken = startToken) => {
    const pre = current[key] && !prev?.[key] ? startToken : '';
    const post = current[key] && !next?.[key] ? endToken : '';

    return (content) => `${pre}${content}${post}`;
  };
}

function today() {
  const [date] = new Date().toISOString().split('T');

  return date;
}

export { formatters, frontMatter };

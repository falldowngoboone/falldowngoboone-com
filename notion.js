//@ts-check
import { Client } from '@notionhq/client';
import { writeFile } from 'fs/promises';

const NOTION_TOKEN = process.env.NOTION_TOKEN;

const notion = new Client({
  auth: NOTION_TOKEN,
});

async function readBlocks(blockId) {
  blockId = blockId.replaceAll('-', '');

  try {
    const { results } = await notion.blocks.children.list({
      block_id: blockId,
    });

    const childRequests = results.map(async (block) => {
      if (block.has_children) {
        const children = await readBlocks(block.id);
        const { type, [type]: typeContent } = block;
        return { ...block, [type]: { ...typeContent, children } };
      }
      return block;
    });

    const expandedResults = await Promise.all(childRequests);

    return expandedResults;
  } catch (error) {
    console.log('error!');
    console.error(error.body);
  }
}

async function readPageInfo(pageId) {
  const { properties } = await notion.pages.retrieve({
    page_id: pageId,
  });

  return properties;
}

async function readPage(pageId) {
  const pageInfo = readPageInfo(pageId);
  const pageContent = readBlocks(pageId);

  try {
    const [properties, content] = await Promise.all([pageInfo, pageContent]);

    const title = properties.Name;
    const date = properties['Publish Date'];
    const excerpt = properties.Excerpt;
    const tags = properties.Tags;

    return {
      frontMatter: { title, date, excerpt, tags },
      content,
    };
  } catch (error) {
    console.log('error!');
    console.error(error.body);
  }
}

class Writer {
  #writers;

  constructor(writers) {
    this.#writers = writers;
  }

  write(block, pad = '') {
    if (!block) return '';

    if (Array.isArray(block)) {
      return pad + block.map(this.write, this).join('');
    }

    const { type, [type]: typeContent } = block;
    const writer = this.#writers[type];

    // apply annotations if present...

    return writer?.(typeContent, this.write.bind(this)) || block;
  }
}

const writer = new Writer({
  paragraph({ text, children }, write) {
    return [write(text), write(children)].join('\n\n');
  },
  heading_2({ text }, write) {
    return `## ${write(text)}\n\n`;
  },
  heading_3({ text }, write) {
    return `## ${write(text)}\n\n`;
  },
  bulleted_list_item({ text, children }, write) {
    return [`- ${write(text)}`, write(children, '  ')].join(
      children ? '\n\n' : '\n'
    );
  },
  numbered_list_item({ text, children }, write) {
    return [`1. ${write(text)}`, write(children, '   ')].join(
      children ? '\n\n' : ''
    );
  },
  text({ content, link }, write) {
    return write(link ? `[${content}](${link.url})` : content);
  },
});

readPage('7b9c0c66eebd47c6911ecd7f2defad6b') // An article page
  .then((data) => writer.write(data.content))
  .then((data) => writeFile('test.json', data));

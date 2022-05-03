import { Client } from '@notionhq/client';
import slugify from 'slugify';

async function readBlocks(client, blockId) {
  blockId = blockId.replaceAll('-', '');

  try {
    const { results } = await client.blocks.children.list({
      block_id: blockId,
    });

    const childRequests = results.map(async (block) => {
      if (block.has_children) {
        const children = await readBlocks(client, block.id);
        return { ...block, children };
      }
      return block;
    });

    const expandedResults = await Promise.all(childRequests);

    return expandedResults;
  } catch (error) {
    handleClientError(error);
  }
}

async function readPageInfo(client, pageId) {
  try {
    const { properties } = await client.pages.retrieve({
      page_id: pageId,
    });

    return properties;
  } catch (error) {
    handleClientError(error);
  }
}

async function readPage(client, pageId) {
  const pageInfo = readPageInfo(client, pageId);
  const pageContent = readBlocks(client, pageId);

  try {
    const [properties, content] = await Promise.all([pageInfo, pageContent]);

    const {
      Name: title,
      ['Publish Date']: date,
      Excerpt: excerpt,
      Tags: tags,
    } = properties;

    return {
      slug: getSlug(title),
      frontMatter: { title, date, excerpt, tags },
      content,
    };
  } catch (error) {
    handleClientError(error);
  }
}

// TODO: better error handling
function handleClientError(error) {
  console.error(error.body || error);
}

function getClient(options) {
  const client = new Client(options);

  return {
    pages: {
      fetch(pageId) {
        return readPage(client, pageId);
      },
    },
  };
}

function getSlug({ title }) {
  return slugify(
    title
      .map(({ plain_text }) => plain_text)
      .join('')
      .toLowerCase()
  );
}

export { getClient };

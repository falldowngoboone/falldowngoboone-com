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
    const { results, ...blockResponse } = await notion.blocks.children.list({
      block_id: blockId,
    });

    const childRequests = results.map(async (block) => {
      if (block.has_children) {
        const children = await readBlocks(block.id);
        return { ...block, children };
      }
      return block;
    });

    const expandedResults = await Promise.all(childRequests);

    return { ...blockResponse, results: expandedResults };
  } catch (error) {
    console.log('error!');
    console.error(error.body);
  }
}

async function readPage(pageId) {
  const pageInfo = notion.pages.retrieve({
    page_id: pageId,
  });
  const pageContents = readBlocks(pageId);

  try {
    const [info, contents] = await Promise.all([pageInfo, pageContents]);

    return { ...info, contents };
  } catch (error) {
    console.log('error!');
    console.error(error.body);
  }
}

readPage('7b9c0c66eebd47c6911ecd7f2defad6b') // An article page
  .then((data) => JSON.stringify(data, null, 2))
  .then((data) => writeFile('test.json', data));

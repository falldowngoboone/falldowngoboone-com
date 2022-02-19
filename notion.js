//@ts-check
import { Client } from '@notionhq/client';

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

readBlocks('7b9c0c66eebd47c6911ecd7f2defad6b') // An article page
  .then(console.log);

// {
//   object: 'list',
//   next_cursor: null,
//   has_more: false,
//   results: [
//     {
//       object: 'block',
//       id: '4b357a3a-9131-4c2d-837b-57d19565b320',
//       created_time: '2021-12-18T17:23:00.000Z',
//       last_edited_time: '2021-12-18T17:30:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'paragraph',
//       paragraph: [Object]
//     },
//     {
//       object: 'block',
//       id: '3a2532ff-a351-4052-868f-b5dc8b8f5ac9',
//       created_time: '2021-12-18T17:30:00.000Z',
//       last_edited_time: '2021-12-18T17:37:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'paragraph',
//       paragraph: [Object]
//     },
//     {
//       object: 'block',
//       id: '86f01675-ab6f-47a1-9362-3fcf4319fb9e',
//       created_time: '2021-12-18T17:12:00.000Z',
//       last_edited_time: '2021-12-18T17:38:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'heading_2',
//       heading_2: [Object]
//     },
//     {
//       object: 'block',
//       id: '55b7748a-26e8-4cda-9c45-27e4126930d3',
//       created_time: '2021-12-18T17:37:00.000Z',
//       last_edited_time: '2021-12-18T17:43:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'bulleted_list_item',
//       bulleted_list_item: [Object]
//     },
//     {
//       object: 'block',
//       id: '327568dc-231e-4116-a365-5cb3d1bdd83f',
//       created_time: '2021-12-18T17:37:00.000Z',
//       last_edited_time: '2021-12-18T18:36:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'bulleted_list_item',
//       bulleted_list_item: [Object]
//     },
//     {
//       object: 'block',
//       id: '99ab099f-a75c-41f7-8930-26b8e65dabc5',
//       created_time: '2021-12-18T17:37:00.000Z',
//       last_edited_time: '2021-12-18T17:50:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'bulleted_list_item',
//       bulleted_list_item: [Object]
//     },
//     {
//       object: 'block',
//       id: 'a39c78bd-b420-49ae-ac4d-f2d1e9a3981b',
//       created_time: '2021-12-18T17:12:00.000Z',
//       last_edited_time: '2021-12-18T17:21:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'heading_2',
//       heading_2: [Object]
//     },
//     {
//       object: 'block',
//       id: 'cd50ae9b-e140-4696-bb88-8d5fe9431eb0',
//       created_time: '2021-12-18T17:19:00.000Z',
//       last_edited_time: '2021-12-18T17:52:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: true,
//       archived: false,
//       type: 'bulleted_list_item',
//       bulleted_list_item: [Object],
//       children: [Object]
//     },
//     {
//       object: 'block',
//       id: '7bdfeb15-1bb2-44bc-b991-bbbf7b49e14d',
//       created_time: '2021-12-18T17:21:00.000Z',
//       last_edited_time: '2021-12-18T18:37:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: true,
//       archived: false,
//       type: 'bulleted_list_item',
//       bulleted_list_item: [Object],
//       children: [Object]
//     },
//     {
//       object: 'block',
//       id: '4a0924f9-fb35-4d92-9066-267eb5ef3331',
//       created_time: '2021-12-18T17:19:00.000Z',
//       last_edited_time: '2021-12-19T03:17:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'bulleted_list_item',
//       bulleted_list_item: [Object]
//     },
//     {
//       object: 'block',
//       id: 'd393c2be-3c52-4dd0-bf0a-f7e92635a9a6',
//       created_time: '2021-12-18T18:39:00.000Z',
//       last_edited_time: '2021-12-18T18:39:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'heading_2',
//       heading_2: [Object]
//     },
//     {
//       object: 'block',
//       id: '2d6fe885-4663-4506-a822-0021c52baf78',
//       created_time: '2021-12-18T18:39:00.000Z',
//       last_edited_time: '2021-12-18T18:40:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'paragraph',
//       paragraph: [Object]
//     },
//     {
//       object: 'block',
//       id: 'e6379872-9aa3-45b2-8e0f-373ef8855309',
//       created_time: '2021-12-18T18:40:00.000Z',
//       last_edited_time: '2021-12-18T18:46:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: true,
//       archived: false,
//       type: 'bulleted_list_item',
//       bulleted_list_item: [Object],
//       children: [Object]
//     },
//     {
//       object: 'block',
//       id: '13053f12-8292-4c84-a600-7e96bda9ec07',
//       created_time: '2021-12-18T18:46:00.000Z',
//       last_edited_time: '2021-12-19T03:18:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: true,
//       archived: false,
//       type: 'bulleted_list_item',
//       bulleted_list_item: [Object],
//       children: [Object]
//     },
//     {
//       object: 'block',
//       id: '4c69509c-59cd-46a7-8ae1-e2e714c99283',
//       created_time: '2021-12-18T17:13:00.000Z',
//       last_edited_time: '2021-12-18T17:13:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'heading_2',
//       heading_2: [Object]
//     },
//     {
//       object: 'block',
//       id: '98ff85eb-0658-4515-a58b-a766f6f9ac3e',
//       created_time: '2021-12-19T03:20:00.000Z',
//       last_edited_time: '2021-12-19T03:27:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'paragraph',
//       paragraph: [Object]
//     },
//     {
//       object: 'block',
//       id: 'c6cee17e-3ad2-458b-ae42-d4a1230bc168',
//       created_time: '2021-12-18T17:13:00.000Z',
//       last_edited_time: '2021-12-19T21:59:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'bulleted_list_item',
//       bulleted_list_item: [Object]
//     },
//     {
//       object: 'block',
//       id: '55c6f672-3fc1-49bc-a42c-4c3f1c65e37e',
//       created_time: '2021-12-18T17:13:00.000Z',
//       last_edited_time: '2021-12-19T21:59:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'bulleted_list_item',
//       bulleted_list_item: [Object]
//     },
//     {
//       object: 'block',
//       id: '613d549b-bd11-43cd-8250-332927d03815',
//       created_time: '2021-12-18T17:17:00.000Z',
//       last_edited_time: '2021-12-19T21:59:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'bulleted_list_item',
//       bulleted_list_item: [Object]
//     },
//     {
//       object: 'block',
//       id: 'ae8d6799-2f8b-443d-9eff-979b8303bf1a',
//       created_time: '2021-12-18T18:52:00.000Z',
//       last_edited_time: '2021-12-19T21:59:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'bulleted_list_item',
//       bulleted_list_item: [Object]
//     },
//     {
//       object: 'block',
//       id: '3082cefb-b083-472f-b3a0-5465c6b2b94b',
//       created_time: '2021-12-18T18:52:00.000Z',
//       last_edited_time: '2021-12-19T22:00:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'bulleted_list_item',
//       bulleted_list_item: [Object]
//     },
//     {
//       object: 'block',
//       id: '4259ef71-4dc6-46d7-a30c-dfc379b8beb1',
//       created_time: '2021-12-19T22:00:00.000Z',
//       last_edited_time: '2021-12-19T22:00:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'heading_2',
//       heading_2: [Object]
//     },
//     {
//       object: 'block',
//       id: 'ce0e7264-d549-4091-b40b-03e52b76c0b4',
//       created_time: '2021-12-19T22:00:00.000Z',
//       last_edited_time: '2021-12-19T22:01:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'paragraph',
//       paragraph: [Object]
//     },
//     {
//       object: 'block',
//       id: 'b63be2ef-c231-4d68-a5ac-234305e60f64',
//       created_time: '2021-12-19T22:01:00.000Z',
//       last_edited_time: '2021-12-19T22:02:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'paragraph',
//       paragraph: [Object]
//     },
//     {
//       object: 'block',
//       id: '408db0e7-602f-4a1c-b5e2-7b4d853816a6',
//       created_time: '2021-12-19T03:21:00.000Z',
//       last_edited_time: '2021-12-19T03:21:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       has_children: false,
//       archived: false,
//       type: 'paragraph',
//       paragraph: [Object]
//     }
//   ]
// }

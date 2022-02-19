//@ts-check
import { Client } from '@notionhq/client';

const NOTION_TOKEN = process.env.NOTION_TOKEN;

const notion = new Client({
  auth: NOTION_TOKEN,
});

async function readPageInfo() {
  try {
    const page = await notion.pages.retrieve({
      page_id: '7b9c0c66eebd47c6911ecd7f2defad6b', // An article page
    });
    console.log(page); // page info
  } catch (error) {
    console.log('error!');
    console.error(error.body);
  }
}

readPageInfo();

// {
//   object: 'page',
//   id: '7b9c0c66-eebd-47c6-911e-cd7f2defad6b',
//   created_time: '2021-12-18T17:12:00.000Z',
//   last_edited_time: '2022-01-02T01:12:00.000Z',
//   cover: null,
//   icon: null,
//   parent: {
//     type: 'database_id',
//     database_id: '6ae47178-f126-4d31-b2b5-104de4353d89'
//   },
//   archived: false,
//   properties: {
//     'Last Edited': {
//       id: '(WIG',
//       type: 'last_edited_time',
//       last_edited_time: '2022-01-02T01:12:00.000Z'
//     },
//     'Publish Date': { id: '%3BkvS', type: 'date', date: null },
//     Tags: { id: '%40GyO', type: 'multi_select', multi_select: [Array] },
//     Archived: { id: 'vdq%3F', type: 'checkbox', checkbox: false },
//     Name: { id: 'title', type: 'title', title: [Array] },
//     'Created By': { id: 'prop_1', type: 'created_by', created_by: [Object] },
//     Status: { id: 'prop_2', type: 'select', select: [Object] }
//   },
//   url: 'https://www.notion.so/Year-end-review-2021-7b9c0c66eebd47c6911ecd7f2defad6b'
// }

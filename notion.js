//@ts-check
import { Client } from '@notionhq/client';

const NOTION_TOKEN = process.env.NOTION_TOKEN;

const notion = new Client({
  auth: NOTION_TOKEN,
});

async function readDatabase() {
  try {
    const response = await notion.databases.query({
      database_id: '6ae47178f1264d31b2b5104de4353d89', // Articles database
      filter: {
        and: [
          {
            property: 'Status',
            select: {
              equals: 'Published',
            },
          },
        ],
      },
    });
    console.log(response);
  } catch (error) {
    console.log('error!');
    console.error(error.body);
  }
}

readDatabase();

// NOTION_TOKEN=<my token> node notion.js
//
// {
//   object: 'list',
//   results: [
//     {
//       object: 'page',
//       id: '1d06f038-0a3c-4bf7-a946-da10de1ba39b',
//       created_time: '2022-02-10T01:22:00.000Z',
//       last_edited_time: '2022-02-13T02:15:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/The-one-where-this-is-undefined-1d06f0380a3c4bf7a946da10de1ba39b'
//     },
//     {
//       object: 'page',
//       id: '06528615-a54e-4a69-b00c-a006cace2288',
//       created_time: '2022-01-22T14:37:00.000Z',
//       last_edited_time: '2022-02-19T16:30:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Brad-Frost-on-how-to-use-Storybook-06528615a54e4a69b00ca006cace2288'
//     },
//     {
//       object: 'page',
//       id: 'a31ec2d8-d79a-4fe7-8f00-4784fc33f72a',
//       created_time: '2022-01-08T16:52:00.000Z',
//       last_edited_time: '2022-02-06T06:25:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/How-I-blog-in-2022-a31ec2d8d79a4fe78f004784fc33f72a'
//     },
//     {
//       object: 'page',
//       id: '7b9c0c66-eebd-47c6-911e-cd7f2defad6b',
//       created_time: '2021-12-18T17:12:00.000Z',
//       last_edited_time: '2022-02-19T16:31:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Year-end-review-2021-7b9c0c66eebd47c6911ecd7f2defad6b'
//     },
//     {
//       object: 'page',
//       id: '609fdc91-cebf-4800-b46c-5cdcc79959b0',
//       created_time: '2021-04-27T11:36:00.000Z',
//       last_edited_time: '2021-05-16T18:30:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Pardon-the-dust-609fdc91cebf4800b46c5cdcc79959b0'
//     },
//     {
//       object: 'page',
//       id: '4d9ab1d7-b71a-4769-bae8-07cf8fd50cdf',
//       created_time: '2021-03-29T03:48:00.000Z',
//       last_edited_time: '2021-11-06T16:35:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Misadventures-in-web-components-4d9ab1d7b71a4769bae807cf8fd50cdf'
//     },
//     {
//       object: 'page',
//       id: 'b8a8e37d-63d4-4b35-8eb5-4525ec7bb73d',
//       created_time: '2021-03-28T18:30:00.000Z',
//       last_edited_time: '2021-05-16T18:30:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Baking-syntax-highlighting-into-the-site-b8a8e37d63d44b358eb54525ec7bb73d'
//     },
//     {
//       object: 'page',
//       id: '034f285a-0550-4a29-85ba-1be1e7324543',
//       created_time: '2021-03-26T14:37:00.000Z',
//       last_edited_time: '2022-02-19T16:31:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Kicking-Sass-to-the-curb-034f285a05504a2985ba1be1e7324543'
//     },
//     {
//       object: 'page',
//       id: '0ecc60a0-5bca-4b27-9da5-21764ba808d9',
//       created_time: '2021-03-15T03:09:00.000Z',
//       last_edited_time: '2021-05-16T18:30:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/JavaScript-and-native-form-validation-The-best-of-both-worlds-0ecc60a05bca4b279da521764ba808d9'
//     },
//     {
//       object: 'page',
//       id: '8ec7fcbb-17b6-4a2e-acf4-892a853c414a',
//       created_time: '2021-03-05T15:19:00.000Z',
//       last_edited_time: '2021-05-16T18:30:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Hold-off-on-optimizing-JavaScript-performance-8ec7fcbb17b64a2eacf4892a853c414a'
//     },
//     {
//       object: 'page',
//       id: '736c071d-3c5d-45d2-99fd-3b5d931c031d',
//       created_time: '2021-02-27T20:38:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Share-variables-between-JavaScript-and-CSS-736c071d3c5d45d299fd3b5d931c031d'
//     },
//     {
//       object: 'page',
//       id: '43dadf58-ddb3-44ef-b11e-1455defe4e62',
//       created_time: '2021-02-26T23:39:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/How-I-ve-been-writing-my-posts-43dadf58ddb344efb11e1455defe4e62'
//     },
//     {
//       object: 'page',
//       id: 'ccdedf3a-2c26-4643-871d-4d10f43d1303',
//       created_time: '2021-02-21T19:06:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/11-podcasts-for-the-frontend-developer-ccdedf3a2c264643871d4d10f43d1303'
//     },
//     {
//       object: 'page',
//       id: '3333b04a-cc8b-425c-a87b-6e1e86fc5c84',
//       created_time: '2021-02-16T04:41:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/The-curious-case-of-flexbox-gap-and-Safari-3333b04acc8b425ca87b6e1e86fc5c84'
//     },
//     {
//       object: 'page',
//       id: '6e205f37-aac9-4ce8-8a9c-2968bda00cbd',
//       created_time: '2021-02-09T02:45:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Notes-to-my-younger-self-Regarding-accessibility-6e205f37aac94ce88a9c2968bda00cbd'
//     },
//     {
//       object: 'page',
//       id: 'f0bab867-780f-4010-b887-d89aae3d1461',
//       created_time: '2021-02-08T15:32:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/What-is-your-code-communicating-f0bab867780f4010b887d89aae3d1461'
//     },
//     {
//       object: 'page',
//       id: 'ca72d430-db33-4458-a8fb-6171976828d6',
//       created_time: '2021-02-08T12:36:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Fixing-all-the-things-ca72d430db334458a8fb6171976828d6'
//     },
//     {
//       object: 'page',
//       id: 'ab77e46d-c27d-45d8-b9cf-fb562587c97e',
//       created_time: '2021-02-04T22:01:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Debugging-JavaScript-with-binary-search-ab77e46dc27d45d8b9cffb562587c97e'
//     },
//     {
//       object: 'page',
//       id: '2fe4952b-d8d6-41cb-a5d7-669b548c5c99',
//       created_time: '2021-02-01T12:47:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Avoid-premature-abstractions-in-React-2fe4952bd8d641cba5d7669b548c5c99'
//     },
//     {
//       object: 'page',
//       id: '24723a00-225e-49a8-b4c4-d5ab2b67f649',
//       created_time: '2021-01-30T07:27:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/How-to-get-your-pull-request-merged-24723a00225e49a8b4c4d5ab2b67f649'
//     },
//     {
//       object: 'page',
//       id: '6d3cfbb4-08f1-42c2-93e0-1e18fd11cb1b',
//       created_time: '2021-01-30T06:16:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/The-address-element-6d3cfbb408f142c293e01e18fd11cb1b'
//     },
//     {
//       object: 'page',
//       id: '838e665e-a202-4304-bff9-831c3459ee85',
//       created_time: '2021-01-30T06:16:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Description-lists-are-awesome-838e665ea2024304bff9831c3459ee85'
//     },
//     {
//       object: 'page',
//       id: '3f4dfb14-4e4f-49f9-a0b2-f3ab5d2b98f4',
//       created_time: '2021-01-29T04:45:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/The-details-element-3f4dfb144e4f49f9a0b2f3ab5d2b98f4'
//     },
//     {
//       object: 'page',
//       id: '23af66ff-3cfb-4d9e-9f6b-938560337c1b',
//       created_time: '2021-01-29T04:42:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/12-newsletters-for-frontend-developers-23af66ff3cfb4d9e9f6b938560337c1b'
//     },
//     {
//       object: 'page',
//       id: '1928c273-d4fe-458d-b2fc-2ebdd07a0fc1',
//       created_time: '2021-01-29T04:36:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Talk-to-your-React-components-with-custom-events-1928c273d4fe458db2fc2ebdd07a0fc1'
//     },
//     {
//       object: 'page',
//       id: '8888e018-f9b4-4a69-ae9b-d227de50ec87',
//       created_time: '2021-01-29T04:30:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/13-fantastic-web-development-blogs-8888e018f9b44a69ae9bd227de50ec87'
//     },
//     {
//       object: 'page',
//       id: '42b88fcd-15f2-4268-8ae2-20ba107d396c',
//       created_time: '2021-01-29T02:31:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Accessibility-quick-wins-42b88fcd15f242688ae220ba107d396c'
//     },
//     {
//       object: 'page',
//       id: '5f69a7cb-fcda-4633-abb2-3d411e2ccc8e',
//       created_time: '2021-01-29T02:01:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Tips-for-vanilla-JavaScript-DOM-manipulation-5f69a7cbfcda4633abb23d411e2ccc8e'
//     },
//     {
//       object: 'page',
//       id: 'df07cd44-63eb-4a97-89b9-08bdfcb31061',
//       created_time: '2021-01-29T01:48:00.000Z',
//       last_edited_time: '2021-05-16T18:30:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/What-I-learned-blogging-daily-for-a-month-df07cd4463eb4a9789b908bdfcb31061'
//     },
//     {
//       object: 'page',
//       id: 'fcf28522-e022-4109-b1e6-6d0f86d7e080',
//       created_time: '2021-01-29T01:47:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Lean-into-the-fear-fcf28522e0224109b1e66d0f86d7e080'
//     },
//     {
//       object: 'page',
//       id: '8885c243-c17c-4373-a455-3924cfc5cef5',
//       created_time: '2021-01-29T01:38:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/How-I-test-for-accessibility-8885c243c17c4373a4553924cfc5cef5'
//     },
//     {
//       object: 'page',
//       id: '578562fd-b502-4f8a-96ba-180f343ed91d',
//       created_time: '2021-01-29T01:35:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Accessible-Content-578562fdb5024f8a96ba180f343ed91d'
//     },
//     {
//       object: 'page',
//       id: '8d2453bd-8207-4724-901a-65f14199fab2',
//       created_time: '2021-01-29T01:32:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/10-interesting-books-for-developers-8d2453bd82074724901a65f14199fab2'
//     },
//     {
//       object: 'page',
//       id: '8ee7451e-a0b6-45fe-85e5-6e4382372b70',
//       created_time: '2021-01-29T01:30:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Online-resources-to-learn-web-development-8ee7451ea0b645fe85e56e4382372b70'
//     },
//     {
//       object: 'page',
//       id: 'f57ebdcb-e8a0-405f-a4b8-54c7aa3b875a',
//       created_time: '2021-01-29T01:27:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/On-changing-careers-f57ebdcbe8a0405fa4b854c7aa3b875a'
//     },
//     {
//       object: 'page',
//       id: 'f9bb6a12-380a-4c27-81cd-be8f5e2758f5',
//       created_time: '2021-01-16T19:02:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Understand-the-context-of-code-you-copy-f9bb6a12380a4c2781cdbe8f5e2758f5'
//     },
//     {
//       object: 'page',
//       id: '657ace75-80af-4514-a3b5-b48414f2f1b2',
//       created_time: '2021-01-15T14:03:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Blogruary-28-days-of-posting-657ace7580af4514a3b5b48414f2f1b2'
//     },
//     {
//       object: 'page',
//       id: 'ac1ec05a-4131-4800-906e-892de2ff086c',
//       created_time: '2021-01-15T13:59:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Building-habits-through-relationships-ac1ec05a41314800906e892de2ff086c'
//     },
//     {
//       object: 'page',
//       id: '09e16d83-9bf8-4a43-9a47-589cd0974c50',
//       created_time: '2021-01-13T16:04:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Your-experience-counts-09e16d839bf84a439a47589cd0974c50'
//     },
//     {
//       object: 'page',
//       id: '3e8766b5-f646-4fd0-a428-6dfa54aae85e',
//       created_time: '2020-12-06T16:39:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Year-end-review-2020-3e8766b5f6464fd0a4286dfa54aae85e'
//     },
//     {
//       object: 'page',
//       id: '26ae29cb-e6e1-4cc8-8903-6c516d3770fe',
//       created_time: '2020-10-18T15:40:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/How-I-m-redesigning-my-blog-26ae29cbe6e14cc889036c516d3770fe'
//     },
//     {
//       object: 'page',
//       id: '5b8889e9-3978-4d73-99cd-5d8dc8e9bc8b',
//       created_time: '2019-10-26T16:21:00.000Z',
//       last_edited_time: '2021-03-01T21:54:00.000Z',
//       created_by: [Object],
//       last_edited_by: [Object],
//       cover: null,
//       icon: null,
//       parent: [Object],
//       archived: false,
//       properties: [Object],
//       url: 'https://www.notion.so/Accessible-Websites-and-the-Evil-Corporation-5b8889e939784d7399cd5d8dc8e9bc8b'
//     }
//   ],
//   next_cursor: null,
//   has_more: false
// }

//@ts-check
import { writeFile, mkdir } from 'fs/promises';

import { getClient } from './client.mjs';
import { getPrinter } from './printer.mjs';
import { formatters, frontMatter } from './formatter-markdown.mjs';

const CLIENT_TOKEN = process.env.CLIENT_TOKEN;

async function main() {
  if (process.argv.length < 3) {
    console.log('Usage: npm run publish:page [pageId]\n');
    return 1;
  }

  const pageId = process.argv[2];
  const client = getClient({
    auth: CLIENT_TOKEN,
  });

  const printer = getPrinter(formatters, { frontMatter });

  try {
    const data = await client.pages.fetch(pageId);
    const dir = `./src/blog/${data.slug}`;

    await mkdir(dir, { recursive: true });
    return await writeFile(`${dir}/index.md`, printer.print(data));
  } catch (error) {
    console.error(error);
  }

  return 1;
}

main();

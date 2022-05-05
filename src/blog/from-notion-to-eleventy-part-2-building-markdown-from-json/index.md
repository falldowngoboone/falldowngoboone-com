---
title: "From Notion to Eleventy part 2: Building Markdown from JSON"
date: 2022-05-05
excerpt: In this continuation of my Notion API series, I explore how to transform a bunch of JSON into a bunch of Markdown.
tags:
  - javascript
---

This is the second article in an ongoing series where I explore using Notion’s API to directly build a blog post for Eleventy. In [the first post of this series](https://www.falldowngoboone.com/blog/from-notion-to-eleventy-part-1-the-notion-api/), I used the Notion API to write a local JSON file representing all the data that I need to stitch together a blog post. In this blog post, I’m going to turn that ball of JSON into a Markdown file.

{% aside %}
This post focuses more on the *why* and *how* of my current solution. If you’re just interested in the code, you can [check that out on GitHub](https://github.com/falldowngoboone/falldowngoboone-com/tree/main/scripts/publish-page).
{% endaside %}

You might ask, *Ryan, doesn’t Notion already have a Markdown export feature?* Yes, Notion *does* have a Markdown export feature, but there are a couple reasons why I want something more custom. 

First, every time I export an article, the first thing I have to do (aside from unpacking the `zip` package, renaming the file, and moving it to the appropriate directory) is format the front matter. This work is trivial but tedious, and surprisingly open to error.

```yaml
title: "This is an example of my front matter"
date: 2022-02-22
excerpt: "Sometimes I include an excerpt here."
tags:
  - example
  - front matter
```

Second, I would like more control over how to interpret the content I get from Notion. For example, Notion exports callout blocks as `<aside>`s with emoji icons. I would like to write those callout blocks as custom Eleventy [paired shortcodes](https://www.11ty.dev/docs/shortcodes/#paired-shortcodes) or even React components.

```markdown
{% aside %}
This is an example of my `aside` shortcode. It renders as an `aside` 
with a special class.
{% endaside %}
```

## The plan

I’ve never written a Markdown formatter before, but I know I need to start with breaking the problem down into manageable steps. The plan will most likely change throughout the process as I surface unknown or unanticipated challenges, but it serves as a good starting place. After a little bit of thought, my plan is as follows:

1. **Combine page properties and the main content into a single JSON structure.** To write the entire file, I’ll *at least* need the page properties and child blocks. I can combine both pieces into a single object like this:
    
    ```json
    {
      "frontMatter": {/* page properties */},
      "content": {/* child blocks */}
    }
    ```
    
1. **Format the front matter.** On my blog, [front matter](https://www.11ty.dev/docs/data-frontmatter/) is formatted in YAML, which is whitespace sensitive. I think I can utilize a simple template literal to properly format this, but I may need something to format rich text objects, which is a trickier problem than it may initially seem.
1. **Format the content.** My blog posts are formatted in Markdown which, like YAML, is whitespace sensitive. Unlike the front matter, though, I can’t use template literals due to the dynamic nesting of child blocks. I’ll need to figure out how to properly write line padding and line returns to the page. And just like the previous step, I’ll need a solution for formatting rich text objects.
1. **Create the file structure for the post and write the file.** This is work I’m very familiar with, at least at a level that’s needed for the initial solution.

{% aside %}
I recently broke down [my personal framework for solving complex problems](https://www.falldowngoboone.com/blog/how-i-solve-complex-problems/), just in case you’re interested.
{% endaside %}

I will start with step three, formatting the content, which I believe demands the most effort. I already have code that fetches page properties and content, so step one seems like it’s simply writing a third function that combines the first two calls. Step four, as I’ve noted, is something I’ve done multiple times in the past. And I’m guessing that if I can solve step three, I’ll be in a much better position to finish step two quite easily.

## Let’s print a page

My approach to writing the page content is to imagine I’m writing the page myself in a text editor. When writing Markdown, I start a new line, indent, write my content, rinse and repeat. This metaphor will help me define methods and variable names.

I’ll also need a way to format content before I write it to the page. When I’m writing Markdown, I *just know* that two hashes and a space before content (`## Content`) denotes a second-level heading. Since each [block object](https://developers.notion.com/reference/block) in the Notion API has a type and configuration specific to that type, I can build methods for each block type that *just know* how to format that type with the given configuration.

With this context in mind, this is what I came up with:

```javascript
class Printer {
  #writers;
  #opts;
  #indentLevel = 0;
  #page = [];

  constructor(writers, opts) {
    this.#writers = writers;
    this.#opts = opts;
  }

  #writeProperties(properties) {
    const { frontMatter } = this.#opts;
    this.#writeLine(frontMatter(properties));
  }

  #writeContent(block, parent = null, index = 0, blocks = []) {
    if (!block) return;

    if (Array.isArray(block)) {
      return block.forEach((child, i) =>
        this.#writeContent(child, parent, i, block)
      );
    }

    const writer = this.#writers[block.type];

    writer?.({
      block,
      parent,
      index,
      blocks,
      writeLine: this.#writeLine.bind(this),

      // convenience fields
      isFirst: index === 0,
      isLast: index === blocks.length - 1,
      prev: blocks[index - 1] || null,
      next: blocks[index + 1] || null,
      getConfig({ type, [type]: config }) {
        return config;
      },
    });

    if (block.has_children) {
      this.#indent();
      this.#writeContent(block.children, block, index, blocks);
      this.#dedent();
    }
  }

  #writeLine(content = '') {
    this.#page.push(''.padStart(this.#indentLevel * SPACES));
    this.#page.push(content);
    this.#page.push(NEW_LINE);
  }

  #indent() {
    this.#indentLevel++;
  }

  #dedent() {
    this.#indentLevel--;
  }

  #printPage() {
    return this.#page.join('');
  }

  print({ frontMatter, content }) {
    this.#writeProperties(frontMatter);
    this.#writeContent(content);
    return this.#printPage();
  }
}
```

My writing metaphor’s “page” is represented as a plain array. Pushing content to the array “writes” to the page, then joining the array and returning the result “prints” the page. A single, public method (`print`) takes our content data structure as an argument, writes it to the page, and returns the results as one continuous string. The `writers` parameter of the constructor contains the methods that “know” how to format block types.

Perhaps the most interesting block of code in this class is the `#writeContent` method:

```javascript
#writeContent(block, parent = null, index = 0, blocks = []) {
  if (!block) return;

  if (Array.isArray(block)) {
    return block.forEach((child, i) =>
      this.#writeContent(child, parent, i, block)
    );
  }

  const writer = this.#writers[block.type];

  writer?.({
    block,
    parent,
    index,
    blocks,
    writeLine: this.#writeLine.bind(this),

    // convenience fields
    isFirst: index === 0,
    isLast: index === blocks.length - 1,
    prev: blocks[index - 1] || null,
    next: blocks[index + 1] || null,
    getConfig({ type, [type]: config }) {
      return config;
    },
  });

  if (block.has_children) {
    this.#indent();
    this.#writeContent(block.children, block, index, blocks);
    this.#dedent();
  }
}
```

{% aside %}
This code, especially the signature for `#writeContent`, was heavily influenced by Tan Li Hau’s excellent article [*Manipulating AST with JavaScript*](https://lihautan.com/manipulating-ast-with-javascript/). I highly recommend checking it out. In the article, Tan explains how parsing libraries use the Visitor pattern to manipulate nested data structures like our block objects.
{% endaside %}

This method recurses through the content blocks, pulls off the correct writer method, and passes in a whole slew of data. This data includes a `writeLine` method, which writes a single line to the private `#page` array, including new lines and proper indentation. Here’s a look at what my Markdown writers look like:

```javascript
const formatters = {
  paragraph({ block, writeLine, isLast, getConfig }) {
    const { rich_text } = getConfig(block);

    writeLine('');
    writeLine(formatRichText(rich_text));
    isLast && writeLine('');
  },

  heading_2({ block, writeLine, isLast, getConfig }) {
    const { rich_text } = getConfig(block);

    writeLine('');
    writeLine(`## ${formatRichText(rich_text)}`);
    isLast && writeLine('');
  },

  bulleted_list_item({ block, prev, writeLine, getConfig }) {
    const { rich_text } = getConfig(block);

    if (prev && !prev.type.includes('list_item')) {
      writeLine('');
    }

    writeLine(`- ${formatRichText(rich_text)}`);
  },
  // ...more
};

function formatRichText(richTextObjects = []) {
  // more on this later...
}
```

The writer methods have complete control over how they are written based on their siblings. For example, a `paragraph` type can add an extra line after itself if it is the last block in the array and list items can add an extra line before themselves if they follow a block that is not a list item. 

This architecture allows me the flexibility of changing the output format via different writers while leaving the main compositional logic untouched. The only thing I might later change in the `Printer` class is making indentation and newlines optional since some formats aren’t whitespace dependent.

I’m limiting direct interaction with the `Printer` class by only exporting a function (`getPrinter`) that instantiates the class:

```javascript
// in printer.js
function getPrinter(writers, opts = {}) {
  return new Printer(writers, opts);
}

export { getPrinter };

// elsewhere...
import {getPrinter} from 'printer'
import {formatters} from 'formatter-markdown'

const myPrinter = getPrinter(formatters, {...opts})

myPrinter.print(dataFromNotion)
```

This allows me the freedom to rewrite the `Printer` however I want (e.g. with closures instead of a `class`) without having to update everywhere the class is accessed. It also removes any ambiguity about how to instantiate a `Printer` (though I don’t think I’ve ever had that problem, it’s something I’ve constantly read about in articles and books).

At this point, we have all the code needed to transform the blocks we get back from Notion into block-level content. Formatting inline content, however, is a bit trickier.

## Rich text formatting

In the Notion API, inline content is split into arrays of [rich text objects](https://developers.notion.com/reference/rich-text). Like block objects, each rich text object contains a type (`"text"`, `"mention"` and `"equation"`) and corresponding configuration. Additionally, each contains an [annotations](https://developers.notion.com/reference/rich-text#annotations) object, which includes all the local styling information:

```json
[
  {
    "type": "text",
    "text": {
      "content": "This is an example "
    },
    "annotations": {
      "bold": false,
      "italic": true,
      "strikethrough": false,
      "underline": false,
      "code": false,
      "color": "default"
    },
    ...
  },
  {
    "type": "text",
    "text": {
      "content": "of rich text objects."
    },
    "annotations": {
      "bold": true,
      "italic": true,
      "strikethrough": false,
      "underline": false,
      "code": false,
      "color": "default"
    },
    ...
  }
]
```

There are two main approaches to applying the annotations to the content fragments. One method is to treat each fragment individually, applying the start and end token for each annotation object. This works great for HTML but breaks Markdown interpretation. Here’s an example of this technique for both HTML (`em` and `strong`) and Markdown (`*` and `**`) using the previous rich text objects:

```markdown
<!-- this works with HTML -->
<em>This is an example </em><strong><em>of rich text objects.</em></strong>

<!-- whitespace and adjacent duplicate tokens break Markdown interpretation -->
*This is an example ****of rich text objects.***
```

The first fragment ends with whitespace, so the first group of italic tokens (`*`) isn’t properly interpreted in Markdown. We could check for whitespace at the end of each fragment, pop it off, add the token, then reapply the whitespace, but that would break continuous styles like `strikethrough`. The best fix is to span tokens of adjacent fragments with duplicate styles.

```markdown
<!-- now works with italics tokens spanning the entire line -->
*This is an example **of nested styling.***
```

This method involves analyzing rich text objects in possible groups of three: the current object we are formatting, as well as the previous and following objects (if they exist). For each `true` annotation for the current object, if the previous object doesn’t have the current annotation, we add the beginning token. If the next object doesn’t have the current annotation, we add the ending token.

```javascript
richTextObjects.map(({ type, [type]: config, annotations }, i) => {
  let formatted = '';
  const prev = richTextObjects[i - 1];
  const next = richTextObjects[i + 1];

  if (annotations.italic) {
    const startToken = !prev?.annotations.italic ? '*' : '';
    const endToken = !next?.annotations.italic ? '*' : '';
    
    formatted = `${startToken}${config.content}${endToken}`;
  }
  if (annotations.bold) {
    const startToken = !prev?.annotations.bold ? '**' : '';
    const endToken = !next?.annotations.bold ? '**' : '';
    
    formatted = `${startToken}${config.content}${endToken}`;
  }
  // ...link, striketrhough, etc.
}
```

This logic is not only used to apply the annotation tokens but the link tokens as well. To DRY up this code, I’ve abstracted out the token creation into a factory:

```javascript
function createFormatFactory(current, prev, next) {
  return (key, startToken, endToken = startToken) => {
    const pre = current[key] && !prev?.[key] ? startToken : '';
    const post = current[key] && !next?.[key] ? endToken : '';

    return (content) => `${pre}${content}${post}`;
  };
}
```

This factory is basically three functions that gradually apply formatting arguments in separate layers. Each formatting function needs a current, previous, and next source object (for the styles, it’s the `annotations` object, and for the link, it’s the rich text object’s type configuration), so that layer is captured first. 

The next layer defines the source object’s `key` and what tokens to apply. Note that the `endToken` defaults to the `startToken` so I don’t have to pass in two `*` tokens for `italic`, two `**` tokens for `bold`, etc. 

Finally, the last layer applies the derived tokens to some content. Here’s an example of using this factory to create and apply an `italic` style:

```javascript

const content = 'This is some content';
const annotations = { italic: true };
const previousAnnotations = { italic: false };
const nextAnnotations = { italic: false };
const formatFromAnnotations = createFormatFactory(
  annotations,
  previousAnnotations,
  nextAnnotations
);

const italic = formatFromAnnotations('italic', '*')

italic(content) // '*This is some content*"
```

We will eventually end up with a group of formatter functions that will be applied in a fixed order. We start with `code` since nesting any tokens inside of a `code` style will not be interpreted by Markdown. Application with a fixed order along with spanning styles creates certain edge cases that will break (e.g. a `code` spanning over a `link`). In practice, these edge cases have been few and far between, so I am choosing to ignore them right now.

When applying multiple functions to a single source, I immediately reach for a `compose` function, which simply composes multiple functions together. Using some more recent JavaScript, creating a `compose` function is trivial:

```javascript
function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}
```

Here is a comparison of applying several functions inline versus using compose:

```javascript
const fn1 = (arg) => {...}
const fn2 = (arg) => {...}
const fn3 = (arg) => {...}
const fn4 = (arg) => {...}

const result = fn4(fn3(fn2(fn1(someArg))))

const composedResult = compose(fn4, fn3, fn2, fn1)(someArg)
```

Notice that we apply the functions from right to left, mimicking the order they appear when composing them inline. That is why we use `Array.prototype.reduceRight` in the definition of `compose`. This convenience method allows us to reduce an array in reverse order.

{% aside %}
The `compose` function is a [functional programming](https://en.wikipedia.org/wiki/Functional_programming) technique that can be quite useful when you need to combine several pieces of functionality flexibly. Similarly, [`pipe`](https://itnext.io/write-better-javascript-function-composition-with-pipe-and-compose-93cc39ab16ee) composes several functions, but in a left-to-right direction.
{% endaside %}

Now that we have the basis for our inline formatting logic, we can put the pieces together in our `formatRichText` function:

```javascript

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
```

At this point, we are officially done with step three of our plan. We now have a flexible system for styling block-level content, and an efficient way to format rich text objects. We should have more than enough tooling to take on step two, building the page’s front matter.

## The front matter

Front matter is truly a separate concern from the page content, but for the time being, I am choosing to tie front matter generation directly to my Markdown formatting. I’ll explain why in a minute. First, let’s examine what needs to be built.

The front matter of my page is represented in Notion as [page properties](https://developers.notion.com/reference/property-value-object). Currently, my front matter consists of:

- `title` - This is the title of the page, built from a [`title` property](https://developers.notion.com/reference/property-value-object#title-property-values).
- `date` - This is the publish date of the article, built from a [`date` property](https://developers.notion.com/reference/property-value-object#date-property-values).
- `tags` - This is an array of taxonomy used to organize my articles, built from a [`multi_select` property](https://developers.notion.com/reference/property-value-object#multi-select-property-values).
- `excerpt` - This is a fairly new property that allows me to add a short summary of the article, built from a [`rich_text` property](https://developers.notion.com/reference/property-value-object#rich-text-property-values).

When assembled, my typical page front matter looks like this:

```yaml
title: "Here it is: An example article"
date: 2022-01-01
excerpt: "This is an example of [front matter](https://www.11ty.dev/docs/data-frontmatter/). It supports *rich* text formatting."
tags:
  - example
  - fake
```

My front matter is structured to support rich text in my `excerpt` field, and since I already have a Markdown rich text formatter, I’m going to default to formatting my front matter with Markdown. This is the biggest reason I’m tying front matter generation to the formatter.

With that in mind, let’s look at the front matter generator:

```javascript
function frontMatter({ title, date, excerpt, tags }) {
  return `---
title: "${title.title.map(({ plain_text }) => plain_text).join('')}"
date: ${date.date?.start || today()}
excerpt: "${formatRichText(excerpt.rich_text)}"
tags:
${tags.multi_select.map(({ name }) => `  - ${name}`).join('\n')}
---`;
}
```

The `frontMatter` function takes our custom properties object (`page.frontMatter`) and combines the data with a string template literal. I kept this function simple on purpose because I may at some point decide to use a [different format for my front matter](https://www.11ty.dev/docs/data-frontmatter/#alternative-front-matter-formats) altogether.

As previously mentioned, this function lives with the Markdown content formatter because it relies on `formatRichText`, but front matter generation is a concern separate from content generation. I’m contemplating pulling the main logic of that function into the `Printer` class, but that’s a problem for Future Ryan.

## Revisiting our Notion client

Now that I have most of the formatting out of the way, I want to pull my client code from [the previous article in this series](https://www.falldowngoboone.com/blog/from-notion-to-eleventy-part-1-the-notion-api/) into a new module. I’m going to take this time to tweak the code a bit as well. Here’s the entirety of the new client module:

```javascript
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
```

I’m combining the page info and page content methods to return the data structure our `Printer.print` method expects. I’m also including a `slug` since it’s a concern closely related to the page’s properties, and it’s much easier to encapsulate two related concerns than it is to expose a method that leaks module details to another module.

I’m exporting a single method, `getClient`, that returns a simple namespaced object. This gives me the freedom to add new methods in the future if necessary, or completely reimplement existing methods without having to touch other code.

## Putting it all together

We now have all the major pieces to pull down page data, create the front matter from page properties, and output the page content as Markdown. The final step is to combine these pieces and write the result to a local file. To do that, I’ve written a `main` function that imports the client and formatting methods and uses Node’s file system module to write the file:

```javascript
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
```

This function is tied to an npm script, `publish:page`, and takes a page ID as an argument:

```bash
npm run publish:page -- [pageId]
```

The script fetches the page data using our client, creates the blog post’s directory using the slug from the page data, then writes the file using our printer class.

## Conclusion

This article focused on pulling Notion page content down, formatting block and rich text objects to Markdown, and writing that content locally to a new file. I have effectively replaced the Markdown export feature of Notion with something much more custom. I have also highlighted a hand full of techniques aimed at making the code more flexible.

This feels like a good stopping point, but this is by no means the end of this project. I’ve begun using this script to build my post pages, and I’ve already identified several areas for improvement. I’ll continue to post updates as I come across any bugs or improvements, but you can always get the latest and greatest code from my website’s repo.

Well, that wraps things up for this post. Thank you for sticking with it all the way through. If you liked this article or found it useful, please share it with a friend, and once you do, [let me know](https://twitter.com/therealboone). It’s free to you and it helps me out tremendously.

Thanks for stopping by. Until next time!

## Resources

- Creating a Next.JS blog with Notion: [https://samuelkraft.com/blog/building-a-notion-blog-with-public-api](https://samuelkraft.com/blog/building-a-notion-blog-with-public-api)
- Creating a CMS with Appsmith and Notion: [https://www.appsmith.com/blog/using-the-notion-api-to-build-a-content-management-system](https://www.appsmith.com/blog/using-the-notion-api-to-build-a-content-management-system)
- Creating the Notion API: [https://www.notion.so/blog/creating-the-notion-api](https://www.notion.so/blog/creating-the-notion-api)
- A Guide to Parsing: Algorithms and Terminology [https://tomassetti.me/guide-parsing-algorithms-terminology/](https://tomassetti.me/guide-parsing-algorithms-terminology/)
- Manipulating AST with JavaScript [https://lihautan.com/manipulating-ast-with-javascript/](https://lihautan.com/manipulating-ast-with-javascript/)

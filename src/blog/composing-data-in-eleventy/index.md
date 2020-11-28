---
title: Composing data in Eleventy
date: 2020-11-28
tags:
  - development
  - eleventy
---

A lot of what I do at [The Container Store](https://www.containerstore.com/welcome.htm) involves page templates, and one of the biggest challenges with template work (and components, for that matter) is creating a system that's flexible yet maintainable. One of the ways flexibility can be achieved is by giving child elements a way to hook into the parent element. In JSP templates (what we use at The Container Store), template hooks can be added via [the `invoke` action](https://www.oreilly.com/library/view/javaserver-pages-3rd/0596005636/re18.html), but I wanted to figure out how to do this on my personal Eleventy site.

## The use case

I use [Prism.js](https://prismjs.com) to dynamically style my code blocks, and [the basic way to use Prism.js](https://prismjs.com/#basic-usage) relies on the presence of both a CSS file and a JavaScript file to be loaded on a page. The JavaScript adds classes to code blocks based on their type, and the CSS themes the blocks accordingly. The easiest (naive) way to include these assets in Eleventy is to add them directly to a global template:

{% raw %}
```html
<!-- _includes/default.njk -->
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{ title }}</title>
  <meta name="description" content="{{ description }}" />
  <link rel="stylesheet" href="/css/global.css" />
  <!-- Prism.js theme styles -->
  <link rel="stylesheet" href="/css/prism-theme.css" />
</head>

<body>
  <div class="o-page">
    <header class="c-header">
      <!-- ...header content -->
    </header>
    <main id="main">
      <!-- render child content -->
      {{ content | safe }}
    </main>
    <footer class="c-footer">
      <!-- ...footer content -->
    </footer>
  </div>
  <!-- Prism.js JavaScript -->
  <script src="/js/prism.js"></script>
</body>

</html>
```
{% endraw %}

In my case, I have two child templates based off of my global template, `_includes/page.njk`, which is the template for simple pages, and `_includes/post.njk`, the template for all of my blog posts. Since both are children of the global template, both receive the Prism.js JavaScript and CSS, even though only the post template will ever need it. We could move the script and CSS to the post template:

{% raw %}
```html
<!-- _includes/post.njk -->
---
layout: default
---

<!-- Prism.js theme styles -->
<link rel="stylesheet" href="/css/prism-theme.css" />
<h1>{{ title }}</h1>
{{ content | safe }}
<!-- Prism.js JavaScript -->
<script src="/js/prism.js"></script>
```
{% endraw %}

The problem is the child templates render in the middle of the final page structure, meaning the `link` and `script` tags would render inside the `main` element:

```html
<!-- rendered post -->
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The page title</title>
  <meta name="description" content="The page description" />
  <link rel="stylesheet" href="/css/global.css" />
</head>

<body>
  <div class="o-page">
    <header class="c-header">
      <!-- ...header content -->
    </header>
    <main id="main">
      <!-- Prism.js theme styles -->
      <link rel="stylesheet" href="/css/prism-theme.css" />
      <h1>The page title</h1>
      <p>...template content...</p>
      <!-- Prism.js JavaScript -->
      <script src="/js/prism.js"></script>
    </main>
    <footer class="c-footer">
      <!-- ...footer content -->
    </footer>
  </div>
</body>

</html>
```

While technically this works, it's not optimal. Ideally, we want all stylesheets to render in the document `head` and all scripts to render just before the closing `body` tag, both of which are outside the scope of the child templates. 

## Using `extends`

The template language I'm using is [Nunjucks](https://mozilla.github.io/nunjucks/), which, as luck would have it, has a built-in way to do this using [`extends`](https://mozilla.github.io/nunjucks/templating.html#extends):

{% raw %}
```html
<!-- _includes/default.njk -->

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The page title</title>
  <meta name="description" content="The page description" />
  <link rel="stylesheet" href="/css/global.css" />
  {% block head %}{% endblock %}
</head>

<body>
  <div class="o-page">
    <header class="c-header">
      <!-- ...header content -->
    </header>
    <main id="main">
      {% block content %}{% endblock %}
    </main>
    <footer class="c-footer">
      <!-- ...footer content -->
    </footer>
  </div>
  {% block script %}{% endblock %}
</body>

</html>
```
{% endraw %}

{% raw %}
```html
<!-- _includes/post.njk -->

<!-- absolute paths in `extends` resolve to the `_includes` directory -->
{% extends "default.njk" %}

{% block head %}
<!-- Prism.js theme styles -->
<link rel="stylesheet" href="/css/prism-theme.css" />
{% endblock %}

{% block content %}
<h1>The page title</h1>
<p>...template content...</p>
{% endblock %}

{% block script %}
<!-- Prism.js JavaScript -->
<script src="/js/prism.js"></script>
{% endblock %}
```
{% endraw %}

This works in Eleventy, but not without limitations. 

First of all, Eleventy won't process [front matter](https://www.11ty.dev/docs/data-frontmatter/) in templates that use `extends`, and no aliases set in Eleventy's configuration will be used in resolving `include` paths (alternatively you may use [relative paths](https://www.11ty.dev/docs/languages/nunjucks/#supported-features)). Second, it locks the project into Nunjucks. One of the things I love about Eleventy is how easily I can change template languages out, but now I _have_ to use Nunjucks. I mean, I like Nunjucks, but, even more so, I like having options.

## Using front matter

If you want a child-specific value available to a parent template, you have to specify it in that page's front matter. We can use this as a way to pass blocks of content up the template chain. I'm going to add two new keys to the front matter, `headContent` and `scriptContent`, and render them in the parent template document:

{% raw %}
```html
<!-- _includes/post.njk -->
---
layout: default
headContent: |
  <!-- Prism.js theme styles -->
  <link rel="stylesheet" href="/css/prism-theme.css" />
scriptContent |
  <!-- Prism.js JavaScript -->
  <script src="/js/prism.js"></script>
---

<h1>{{ title }}</h1>
{{ content | safe }}
```
{% endraw %}

{% raw %}
```html
<!-- _includes/default.njk -->

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The page title</title>
  <meta name="description" content="The page description" />
  <link rel="stylesheet" href="/css/global.css" />
  {{ headContent }}
</head>

<body>
  <div class="o-page">
    <header class="c-header">
      <!-- ...header content -->
    </header>
    <main id="main">
      {{ content | safe }}
    </main>
    <footer class="c-footer">
      <!-- ...footer content -->
    </footer>
  </div>
  {{ scriptContent }}
</body>

</html>
```
{% endraw %}

Notice the pipe character (`|`) in the front matter definition. This defines the style of a [block scalar](https://yaml.org/spec/1.2/spec.html#id2793652) in [YAML](https://yaml.org) (the language the front matter is written in) to keep line breaks. An alternative to this approach would be to pass a list of paths for each key, but I want the flexibility to inline scripts and styles as well:

```html
<!-- some-post.njk -->
---
layout: post
headContent: |
  <style>
    .custom-page-style {
      /* your custom styles here */
    }
  </style>
scriptContent: |
  <script>
    console.log("I'm a custom page script");
  </script>
---

<!-- page content -->
```

However, there's a problem with the code above. Can you see it? It's re-defining the `headContent` and `scriptContent` keys in the front matter, and according to the [Eleventy front matter data documentation](https://www.11ty.dev/docs/data-frontmatter/), "locally assigned front matter values override things further up the layout chain." The page content blocks are clobbering template content blocks, which means the Prism.js assets aren't being loaded on this page. 

## Composing data with `eleventyComputed`

We can fix the front matter key collision issue a couple of ways. 

First, we could create a second template hook that only pages would use (e.g. `pageHeadContent`). That could work, but what if we want to extend the post layout template with another layout template that needs to add custom styles and scripts? Also, it's still possible for a page to accidentally overwrite the `headContent` in front matter. This isn't an issue on small sites, but maybe you're building a sharable theme or you're working with a constantly changing team.

Ideally what we want is some way to compose all of the `headContent` data into a single block. That way we don't have to worry about what key to use in the current layout we are in. That brings us to our second option, which is using Eleventy's [computed data](https://www.11ty.dev/docs/data-computed/).

{% raw %}
```html
<!-- _includes/post.njk -->
---
layout: default
eleventyComputed:
  headContent: |
    <!-- Prism.js theme styles -->
    <link rel="stylesheet" href="/css/prism-theme.css" />
    {{ headContent }}
  scriptContent: |
    <!-- Prism.js JavaScript -->
    <script src="/js/prism.js"></script>
    {{ scriptContent }}
---

<h1>{{ title }}</h1>
{{ content | safe }}
```
{% endraw %}

`eleventyComputed` is a special Eleventy front matter key that grants access to the computed data at the time of rendering the individual page. This is how we can pass data from leaf templates up the layout template chain, allowing us to effectively extend leaf data with template data. Notice the leaf data is included at the end of the template block. This ensures the leaf styles have higher order specificity in the style cascade and leaf scripts can override template scripts if needed.

Now we have composable blocks of code that allow us to tie into the base template and extend the page with whatever functionality or styling we want. This is a great example of how powerful Eleventy can be, even though the basic concepts are so simple.

## Ideas for further exploration

We've explored how to optimize assets in Eleventy templates using composable `eleventyComputed` values. You can easily adapt this idea to add custom art direction, animations or behavior to an individual page, but this is something that has even more uses outside of styles and scripts.

I hope this inspires you to explore more interesting uses of Eleventy's computed data. And if you have a favorite Eleventy tip, [tell me about it on Twitter](https://twitter.com/therealboone)!
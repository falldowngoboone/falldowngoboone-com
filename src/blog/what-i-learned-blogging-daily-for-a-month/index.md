---
title: What I learned blogging daily for a month
date: 2021-03-04
tags:
  - blogging
  - career
  - blogruary
---

I recently challenged myself to [write a blog post every day for a month](https://www.falldowngoboone.com/blog/blogruary-28-days-of-posting/). Up to that point, I had only written eight blog posts for two years. A month later, not only do I have 28 new blog posts, I've learned some valuable lessons about my blogging process and my website. I wanted to share things about the experience that worked for me and issues I discovered that need attention.

---

## Worked: Setting deadlines

It's surprising how an unmoving date can motivate you to complete a post. One of my recurring issues with blogging has been the tendency to overwork a piece until I completely lose interest. Experience has taught me that time is the biggest enemy of posting, and firm deadlines force you to throw away what's not working and focus on what is.

Being accountable to others dramatically increases the power of deadlines. One of my blogging rules involved announcing in my Twitter feed that I was posting daily. In my mind, I felt like I was accountable to a large audience. Social pressure works, even if it's imaginary[^pressure].

## Worked: Having a healthy backlog

In the middle of February, we experienced the second coldest temperatures ever recorded in North Texas (-2℉, -17℃). That may not be cold for some of you reading this, but our state's infrastructure is poorly prepared for temperatures that cold. Power generation froze up, and several utility buildings lost power, including our water station. Some were without power and water for a week.

I barely wrote during that week, yet I stayed on schedule thanks to my backlog, a running list of ideas in Notion that I use to build out full posts. Sometimes an article I've been working on just isn't working, so it's nice to have a safety net.

## Worked: Cross-publishing on DEV

I decided at the suggestion of [Stephanie Eckles](https://twitter.com/5t3ph) to cross-publish to DEV Community. Cross-publishing ended up being a great decision because DEV's platform exposed me to a bigger audience than I ever would've received on my blog. Coupled with the motivation and encouragement I received from comments and reader interaction, I've decided to continue doing this for all posts.

There are, however, some challenges I've found cross-publishing, mainly due to differences in platforms. My site is built in Eleventy, and my front matter formatting doesn't completely align with DEV's. There are also differences in how I mark up embedded content. If you notice, hardly any of my posts have CodePens embedded, and I didn't use any images.

Now that I have some time, I'm going to start ironing out these issues, starting with images. That's a topic I need to address on my site first, which brings me to my first thing that didn't work.

## Did not work: My website styling is lacking

In terms of my blog, [falldowngoboone](https://www.falldowngoboone.com), I discovered many rough edges throughout the month. One such issue that comes to mind is an excerpt filter I created[^filter], which unfortunately doesn't process Markdown properly. If anything in the first 20 words of a post contains Markdown, it's not processed, and if there are any special characters, they are escaped.

It also appears some of the code blocks that Notion produces use a syntax I don't support. I know that may not seem like a big deal, but it's broken syntax highlighting on my site. This should be an easy fix.

Finally, my home page needs an overhaul. When I had only eight posts, it was easy to find them. Now, it's getting a bit ridiculous. I plan to completely change the homepage design, featuring the most popular articles, my most recent posts, and a link to post archives. I may even add a search (gasp!) at some point.

## Did not work: My publishing process sucks

Near the end of the month, I wrote about [how I write my posts](https://www.falldowngoboone.com/blog/how-i-write-my-posts/), and I briefly mentioned some ideas I had for optimizing my publishing flow. Currently, I walk through at least 18 different steps to publish a single blog piece. I think better tools and well-planned automation can reduce those steps.

Notion, as I'm currently using it, doesn't fit with my publishing process. Unfortunately, its exported Markdown output doesn't align with the format I use in Eleventy. It would be nice if Notion offered a way to tweak the export formats, but I understand that constraints like this are necessary to allow flexibility in other areas.

One idea I have is to write a script that could convert the exported metadata into front matter. Another idea is to change to a full content management solution, like Sanity. Scripting a solution would mean I could keep using Notion, with the downside of maintenance. Using Sanity would give me a streamlined publishing solution with little toil. I'm still weighing my options here (and I'll make sure to write about whatever choice I make).

Finally, there are areas of my process best suited for automation. My article backlog includes a status flag (Planned, In Progress, and Published[^status]). I'd love to figure out a way to automate In Progress when I schedule the piece and Published once the post has merged.

## What next?

I will not continue to blog daily, as insightful as it's been. But I will focus on creating blog posts at a regular frequency, at least once a week. I hope to improve my communication skills and connect with more amazing people through DEV Community.

Finally, if you're thinking about blogging, do it. Don't worry about whether or not you have something to say. When I began blogging, I was afraid I wouldn't have anything to say. Now I can't stop writing.

That's it for now. If you found this helpful, please let me know by liking this post on DEV Community and following me so you know when I publish. And if you have any questions, don't hesitate to reach out to me on Twitter.

Until next time!

## Most popular posts

In case you're interested, here are my most popular articles from February:

1. [How to avoid premature abstraction in React](https://dev.to/falldowngoboone/how-to-avoid-premature-abstraction-in-react-5672)
2. [Share variables between JavaScript and CSS](https://dev.to/falldowngoboone/share-variables-between-javascript-and-css-5ad0)
3. [How I write my posts](https://dev.to/falldowngoboone/how-i-write-my-posts-4538)

[^pressure]: If you'd like to learn more about different techniques to help you become consistent at blogging or any other habit, check out *Atomic Habits* by James Clear.

[^filter]: In case you didn't know, fdgb runs on [Eleventy](https://www.11ty.dev), a JavaScript-based static site generator that's a joy to use. Filters in Eleventy act like functions that can transform your blog's content. They are simple yet powerful.

[^status]: I'm not completely happy with these names, but they work for now.
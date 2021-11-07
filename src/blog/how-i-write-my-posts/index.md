---
title: How I write my posts
date: 2021-02-27
tags:
  - blogging
  - blogruary
  - career
---

I've been posting a [new article every day this month](https://www.falldowngoboone.com/blog/blogruary-28-days-of-posting/), and it's been interesting. I'll write about that soon, but today I want to share how I put these posts together. Hopefully, you'll learn something new from my process, or see how terrible my process is and give me some advice.

---

## Idea backlog

If you're going to create content, you need a steady stream of ideas. I keep a backlog so I can store notes, write drafts, and constantly reassess what to post next. This post you're reading? It started out in my backlog.

You can keep an idea backlog in whatever tool you use. I use [Notion](https://www.notion.so/) for a few reasons. First, I can access Notion on anything that's connected to the internet, so I can capture an idea before I forget it. Second, Notion gives me the flexibility to organize my content however I want.

For Blogruary, I created a special post in Notion with a list view of all posts tagged "blograry" (each view can have its own special filtering and sorting). This allows me to get a quick look at all the ideas available to me.

For more information on using Notion as a project manager, check out this [Notion masterclass video from Thomas Frank](https://youtu.be/32dLXdB4ozs).

## Writing the post

After adding an idea to the backlog, I paste links to relevant material as well as notes into the created entry. This eventually becomes the blog post itself. Depending on how far along the information is, I'll go ahead and schedule the publish date.

If I'm being honest, this process has been all over the place. Sometimes I'll start the post without any notes, or the post is a long list of notes until the day I have to post. Many times I'm stuck writing and editing the entire post the day I'm supposed to publish (like today).

I've also noticed some issues with writing blog posts in Notion, mainly because of all the manual changes I have to make to the exported Markdown. I'm still trying to figure this part of the process out.

## Publishing

After I've written a post, I'll export it from Notion as Markdown, drop it into my blog's source code, and manually format the [front matter for Eleventy](https://www.11ty.dev/docs/data-frontmatter/). Unfortunately, Notion doesn't output front matter, nor does it allow me to customize how associated data is displayed. This would be a welcome feature.

I've started to run the post content through [Grammarly](https://app.grammarly.com) to correct any grammar mistakes. Grammarly has extensions for all the major browsers, as well as a desktop app that allows you to create a new document for analysis (big thanks to [Stephanie Eckles](https://twitter.com/5t3ph) for that tip). It's free to use the basic features, but I'm considering upgrading.

After making corrections in Grammarly, I'll paste the corrections back into the Markdown file in VS Code, commit the changes, and push them up to GitHub. 

After creating a pull request, [Netlify](https://www.netlify.com) runs a series of checks. While that happens, I create a duplicate of the post on DEV Community. I have to add a [canonical URL](https://dev.to/michaelburrows/comment/125j0) back to my website so I don't get penalized for duplicate content, but in order to do that, I need to publish on [my personal blog](https://www.falldowngoboone.com) first.

By the time I've set up a draft in DEV, my pull request has been verified and is ready to merge. The merge kicks off a deployment to Netlify (yay Netlify!). After merging, I grab the post's URL, add it to the DEV post, then I hit publish.

## Thoughts on the process

So that's what I've been doing this entire month. I learned that Notion is a great tool for organizing and writing, but I need a tool that's closer to the end product. I'm starting to look at [Sanity](https://www.sanity.io) as a viable option. 

I've also been thinking about streamlining the publishing process by automating the duplicate post to DEV. Challenges include differences in front matter and markup. If I can limit myself to only shared markup, that would make the automation much easier.

Finally, if you're thinking about starting a blog, a good place to start is signing up for the [Blogging for Devs](https://bloggingfordevs.com) newsletter from Monica Lent. New subscriptions start with a 7-day blogging course sent directly to your inbox, followed by regular emails filled with tips for content makers.

I will be expanding on the rest of what I've learned in a future post, so if you want to know when that comes out, follow [me on Twitter](https://twitter.com/therealboone). And if you found this post helpful, please let me know by liking it on DEV Community.

Until next time!
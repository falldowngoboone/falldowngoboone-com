---
title: How I test for accessibility
date: 2021-02-11
tags: 
  - accessibility
  - blogruary
---

I wanted to share what my typical accessibility testing sessions look like. This is a quick over, but I hope you find it helpful (and if you haven't done so yet, check out some [accessibility quick wins](https://www.falldowngoboone.com/blog/accessibility-quick-wins/) I wrote about).

## What I typically do

- When I'm developing new UI, I inspect with browser dev tools, typically to confirm labels and semantic roles. I test on Chrome, Safari Technology Preview, and Firefox DeveloperEdition, but I probably lean the most on [Chrome DevTools accessibility tools](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference).
- Next, I'll run [axe-core](https://www.deque.com/axe/) and [Wave](https://wave.webaim.org) against the page. Automated accessibility tools like these only catch about [40% of accessibility bugs](https://accessibility.blog.gov.uk/2017/02/24/what-we-found-when-we-tested-tools-on-the-worlds-least-accessible-webpage/), but they're a great way to find any low-hanging fruit before manual testing.
- If the feature I'm building requires user interaction (and it usually does), I will [test with a keyboard](https://webaim.org/techniques/keyboard/). The first thing I check is to see if I can navigate without a mouse. If I can't see what element has focus on the screen, that's an immediate fail. I next check if tab order is correct. Finally, I check user interactions (can I open and close widgets with just a keyboard, is there proper focus trapping, etc.).

## What I should do

- Test with users. We employ a third-party company that audits our code after we launch a new release, but I'd love to have them involved earlier on (preferably during the design iteration phase).
- Test on Windows (at least Chrome + NVDA). I have no excuse. I'm on a Mac, but I'm running Windows via VMWare Fusion, so I need to Just Do It.
- Test consistently on mobile. Chalk this up to convenience. Or inconvenience. It's next-to-impossible to inspect our developer environment outside of our work computers, so I'm relegated to testing on the Xcode Simulator. I'm hoping we'll make some changes soon that will open this up more, but for now, I'm stuck with our staging environment and a ridiculously long feedback loop.

I'm certain this list will continue to grow, but for now I hope it gives you a sense of where to start. If you have any questions or suggestions, I'm always up for a discussion on [Twitter](https://twitter.com/therealboone).

Until tomorrow!
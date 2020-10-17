---
title: Accessibility is hard, but we can do better
date: 2019-10-27
currentmood: hopeful
tags:
  - a11y
---

Recently I made the trek to New York City to attend SmashingConf. A recurring theme this year was accessibility, and for good reason. The Domino's Pizza case has been trending in the Front End Dev community for a while now, and I've been preoccupied with accessibility as of late as well, due to circumstances surrounding my current place of employment (I think this would be a good time to state that my opinions expressed are solely my own and do not express the views or opinions of my employer, blah, blah, blah).

While I was in New York, I read Robin Rindle's CSS-Tricks article [Why Are Accessible Websites so Hard to Build](https://css-tricks.com/why-are-accessible-websites-so-hard-to-build/), and I think it helps bring to light one of the common misconceptions about corporations and the lack of accessible websites. If I were to sum up my belief why accessible websites are difficult to make, it would be ignorance.

## I am an idiot

I remember taking on the task of making an existing web feature accessible, something that I thought in theory I could do rather easily, but it wasn't until I started to use (or _try_ to use) accessibility tools like VoiceOver that I realized how unequipped I was. To top it off, the entire design and implementation of the feature made it close to impossible to simply bolt accessibility on top (disclosure: I'm the one that built it in the first place. 🤦‍♂️).

This was just one feature. And I thought I initially built it to _be_ accessible. My problem was I had no idea how to confirm my assumptions, nor had I not been instructed on how to test for accessibility. I simply wrote semantic markup and thought that was enough. It was not.

Now imagine a monolithic website created over the course of ten years by dozens of developers, most of whom never even thought about accessibility, and most of whom are no longer with the company. This is what most legacy retail sites are working with.

## Lawsuits are not the solution

According to a [2018 report from UsableNet](https://blog.usablenet.com/2018-ada-web-accessibility-lawsuit-recap-report), an independent, full-service accessibility agency, accessibility-related website lawsuits increased from 814 in 2017 to 2,285 in 2018, up 181%. This report states that even companies proactive in making their sites accessible have been targets of these lawsuits.

Rindle in his aforementioned article says his personal hope is that "[these lawsuits] will get folks to care more about semantics and front-end development best practices." I don't believe they will. I think they will merely propagate a cat and mouse game between lawyers and corporations where a business will fix one thing only to be called out on another thing that _could_ be interpreted as inaccessible.

The sad reality is the only people that seem to be getting anything out of these lawsuits are the plaintiff and defendant lawyers. They get paid regardless.

## Regulation is part of the solution

The basis of these recent lawsuits is the Americans with Disabilities Act, specifically Title III, which "directs [private places of public accommodation] to make 'reasonable modifications' to their usual ways of doing things when serving people with disabilities" and also "take steps necessary to communicate effectively with customers with vision, hearing, and speech disabilities" ([source](https://adata.org/learn-about-ada)).

The ADA became law in 1990, so websites weren't even considered. There have been several judgements regarding websites as places of public accommodation, all with mixed decisions. To this day, Congress has done little in the way of addressing how to define accessibility with regards to websites, let alone even specifically including websites in the ADA. This, in my opinion, is the number one problem we have right now.

There is some guidance as a result of trial decisions that point to [WCAG 2.0 level AA](https://www.w3.org/TR/WCAG20/) ([2.1](https://www.w3.org/TR/WCAG21/) is the latest) as the gold standard of accessibility, but [a 2018 letter from Assistant Attorney General Stephen E. Boyd](https://www.adatitleiii.com/wp-content/uploads/sites/121/2018/10/DOJ-letter-to-congress.pdf) seems to suggest that WCAG is not necessarily the baseline for accessibility, stating that "public accommodations have flexibility in how to comply with the ADA’s general requirements of nondiscrimination and effective communication." This letter, which was written in response to a bipartisan Congressional letter, basically told Congress that they needed to provide more clarity through legislation.

## What we need

It is my personal belief that Congress needs to clarify that websites are indeed covered by Title III of the ADA, and with that, Congress needs to provide clear direction of a standard that websites must adhere to (I'm personally in favor of WCAG). I also would like to see the ADA applied to non-brick-and-mortar websites as well. Then entire web needs to held to the same standard.

I also believe there needs to be an official website accessibility certification process that large corporations must go through annually, provided by an independent third-party auditor. Non-compliance would require a business to submit a plan that must be enacted within a reasonable amount of time, during which a company would be immune to Title III related litigation.

Failure to meet the timeline would result in fees, which would go toward policing legislation and accessibility advocacy.

## What we can do today

In short, we need to build accessible websites. We need to do better as developers being advocates for minorities. We need to do better as an industry with hiring QA and developers with special needs. Perspective and empathy are invaluable tools to build a better web.

I hope to write more in the future about what I'm doing at The Container Store to promote accessibility, as well as future accessibility wins. If nothing else, my hope is that my co-workers see accessibility as a necessity, not a feature. Ignorance is fought with awareness and empathy.

If you agree (or even if you disagree) with anything I've said, [let me know on Twitter](https://mobile.twitter.com/search?q=https%3A%2F%2Fwww.falldowngoboone.com%2Fblog%2Faccessible-websites-and-the-evil-corporation). And please write to your representative and let them know you want clarity on the protection of individuals with disabilities. Finally, be an advocate for accessibility where you are. Whether you are a developer or designer, you can make a difference where you are.

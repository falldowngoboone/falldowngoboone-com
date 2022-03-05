---
title: Preserve intent with architecture decision records
date: 2022-03-05
tags:
  - process
---

The first thing I want to do when I dig into a new codebase is learn everything about it. The second thing I want to do is rewrite it. Whether you’re trying to do the former or the latter, architecture decision records (ADRs) can help.

---

I was first introduced to ADRs at The Container Store, where the technology department adopted them as a way to record large tech decisions, mostly around microservices architecture. My team  adopted ADRs as a way to record front-end architecture decisions for the e-commerce site as well.

As I write this, I’m working on my current team’s first ADR. As part of that exercise, I wanted to write out what I understand about ADRs and how they’ve been helpful to me in the past.

## What is an architecture decision record?

An architecture decision record is a document that records a decision. More than that, ADRs capture context such as the problems a decision is meant to address, alternative solutions, and why this decision was chosen.

In addition to decisions and context, ADRs typically contain decision consequences, both good and bad. Every decision has trade offs, and listing them alongside benefits sheds light on possible concerns to watch for.

As far as ADR structure, there are several [examples of templates](https://github.com/joelparkerhenderson/architecture-decision-record#adr-example-templates) freely available. The first article I ever read on [documenting architecture decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions), written by Michael Nygard, is even written as an ADR.

## Benefits

For small decisions, informative code comments are great. But when you are adopting a practice throughout a project or department, decision records are the best way to communicate publicly what decision is being made and why.

ADRs make the decision process transparent. Many times writing an ADR involves the entire team or department, so everyone has an opportunity to explore the decision and understand why it’s being made. This inclusion can increase decision buy-in and alignment as well, since everyone is signing off on it.

Decision records can be a great onboarding tool as well. Seeing a complete record of decisions can help developers quickly come up to speed on a project. Reading ADRs is much more productive than digging through years of commit history (your team writes [informative commit messages](https://www.falldowngoboone.com/blog/how-to-get-your-pull-request-merged/#follow-commit-message-standards), right?).

Changing code is risky, and not knowing why the code exists makes any change even riskier. Why spend time to rewrite a layer of architecture only to realize after the work is complete that there are holes in the implementation?

Finally, a side benefit of writing an ADR is it’s an opportunity for the author to work on their communication skills. I’ve written before about why I believe [communication is one of the most important skills](https://www.falldowngoboone.com/blog/what-is-your-code-communicating/) for a developer to...develop. ADRs give developers a chance to communicate complex issues in an easy-to-read manner, as well as develop their ability to argue for a solution.

## Decision record tips

If you want to get started with ADRs, the easiest way is to find something undocumented that everyone’s already doing and try writing an ADR for that. You’ll be surprised what you’ll learn when exploring the context and consequences of any decision. You may even stumble upon a better solution.

Whatever the solution is, involve the entire team. Open up a request for comments (RFC) on the decision and make sure everyone is on board. If you can, try to involve every interested engineer in your department. Different engineers bring different perspectives and experience to the table. The more diverse perspectives, the better the decision.

My final tip is to make your ADRs visible and easy to search. You may want to save your ADRs directly to a repo, or maybe add them to a company wiki. Whatever you do, get a consensus on how to create ADRs (maybe write an ADR on that?). At The Container Store, one of my colleagues built a Ruby on Rails CRUD app that streamlined drafting ADRs directly to a PR in a decision record repo, which kinda made it fun to write ADRs.

## What are you waiting for?

Architecture decision records capture decisions, but they also capture the context and consequences of those decisions. ADRs can make the decision process more transparent, increase developer alignment and help onboard new developers. They can even help develop your communication skills. What’s not to love?

If you’ve read this far, my guess is you’re considering adopting ADRs as a practice on your team. My opinion is you should try them. At the very least you’ll start a conversation with your teammates. There’s a good chance, however, that you’ll introduce a productive practice that will endure long after you’ve left.
---
title: Understand the context of code you copy
date: 2021-02-26
tags:
  - career
  - blogruary
---

If a problem is too difficult to solve on our own, sometimes the only course of action is to search, copy, and paste. It's something all developers have done regardless of their experience level.

While there is no shame in copying and pasting code, it can lead to a mess. That's why I have one copy-paste rule that I follow: **understand the context.**

## A reason for everything

Requirements, constraints, and assumptions all play a role in how we write code. Unless you've found a generic solution, the code you copy comes with a context that may not apply to your situation.

The wrong context could cause you to miss story requirements or cause other code to break (e.g. variable name collisions). Taking time to understand the context can help save you and your teammates a headache down the road.

## Learning the context

Throughout my experience of dealing with copied and pasted code, I've seen a few common problems. These can be avoided by asking yourself some questions as you *carefully read the code.*

- **Does this code rely on global state?** This is a common issue with legacy JavaScript codebases that rely on the global Window object to pass data and functions around. If you can, move this code out of global scope. It will help you answer the remaining questions.
- **Is there anything that looks unfamiliar?** Are there APIs used that don't look familiar to you? Look them up and make sure you understand what they are used for and why. Identifying unfamiliar APIs and methods informs the code's context, but it's also an opportunity for you to learn something new.
- **Is there anything unnecessary?** Dead code in a large codebase is scary. No one will touch it, either out of fear or because of the amount of work involved in tracking down usage. Hastily copying and pasting dead code multiplies this tech debt immeasurably. Trim unused code.
- **Do variable names match the domain?** If you're copying from an online source, variables will tend to have generic names. Taking the time to find better names [helps the code communicate better](https://www.falldowngoboone.com/blog/what-is-your-code-communicating/), and captures the context.
- **Does this code have any dependencies?** There are swaths of our codebase that use Require.js and therefore...require...it to be present. Sometimes it's better to remove the need for that dependency by copying and pasting even more code, and sometimes it's better to add the dependency. It all *depends* on the *context* (ah, see what I did there?).
- **Are there any new errors logged after pasting?** The moment you paste code into your codebase, you should check your logging. This reduces the [dev feedback loop](https://www.falldowngoboone.com/blog/the-feedback-loop/) and informs you of any incompatibilities immediately.

## This looks like a lot of work

You may be thinking, *Geez, Ryan, this sounds like it's going to take forever, and the reason I'm copying and pasting code is to save time.* And you're right, this will add time to your solution. But that extra time will ensure that you solve the right problem, meet requirements, and reduce tech debt.

Copying existing code can supercharge your team's velocity, but remember this comes with a cost. If you don't slow down and ask questions, chances are you'll pay the price further down the road, and you'll lose any short-term gains over the long term.

## Take the time to save time

Sometimes copying and pasting existing code is the best course of action. But before do, take the time to understand and adapt the context. The time you spend will save you in the long run.

If you're still reading this, thanks for sticking around to the end! Unless you just skipped to the end. In which case, thanks for at least reading this? If you found this post helpful, please consider liking over on DEV Community, and make sure you [follow me](https://twitter.com/therealboone) so you know when I release a new post.

Until next time!
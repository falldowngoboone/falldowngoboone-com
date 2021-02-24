---
title: How to get your pull request merged
date: 2021-02-24
tags: 
  - blogruary
  - career
  - git
---

When I started my first job as a professional developer, one of my biggest challenges was learning how to create helpful pull requests. I had been using git for a few years at that point, but my experience was limited to merging and pushing directly to the default remote branch. As a result, my first code reviews were fraught with answering questions, rewriting code, and (gulp) interactive rebasing.

What follows is what I've learned from the past few years of crafting pull requests. My hope is they'll help you whether you're starting your first job in development or trying to contribute to your favorite open source project.

## Use atomic commits

Effective pull requests start with [atomic commits](https://sparkbox.com/foundry/atomic_commits_with_git). Atomic commits add value, don't break tests, and are the smallest unit of work possible. A list of such commits may look something like this:

- Add product metadata HTML
- Style product metadata
- Add product metadata JavaScript

Each step in that list focuses on a particular domain of the overall task of adding product metadata, first the markup, then the CSS, and finally the behavior.

Why use atomic commits? First of all, they're easier to read in a code review (more on that in a minute). Second, since they're self-contained, they're easy to revert without breaking anything.

Now that we have well-structured commits, we need to think about the commit message.

## Follow commit message standards

As anyone who has ever plugged a lamp in a wall can tell you, standards are important[^standards]. Different projects may have different commit message standards. Make sure you read and understand them before you contribute.

If you can't find any standards, here's a great article on [how to write commit messages](https://chris.beams.io/posts/git-commit/). My work more or less follows these standards. Here's a high-level summary:

- The subject line should be 50 characters or less to prevent wrapping
- The subject line should be a statement written in [imperative voice](https://www.grammarly.com/blog/imperative/)
- Add a commit message two carriage returns after the subject line
- Commit message lines should be limited to 72 characters

And here's an example commit following these guidelines:

```
Add new awesome feature

Use this space for anything that needs further explanation. You can 
add a list here as well:

- Added the thing
- Had to pull the other thing out into a separate module for reasons
```

It's hard to know what your line character count is when staring into the black abyss of the terminal so you may want to change your default text editor to something you're more comfortable with. I personally like to use VS Code as my editor:

```bash
git config --global core.editor "code --wait"
```

Running that command in your terminal should set up VS Code as the default git editor. The above command assumes you're using git as your version control and have the [VS Code CLI](https://code.visualstudio.com/docs/editor/command-line) installed.

## Keep it short and sweet

I cannot tell you how many pull requests I've personally submitted with 20+ files changed and thousands of lines touched[^prs]. If you've ever tried reviewing a PR like that, you'll know how exhausting it is to simply *read* the entire thing, let alone reason about what's going on.

Pull requests should be kept short. If they can't be kept short, use atomic commits and make sure to arrange your commits in a way that logically tells a story.

Let's imagine we need to add a new form to a project that uses existing logic. The commit history might look something like this:

```
Reformat file to match standards
Refactor variable names for readability
Refactor form submission to extract logic
Add form markup
Style form
Share form logic with the new form
```

This history is arranged to tell a story. The beginning sets up the change with some reformatting and refactoring of existing files. The middle adds and styles the new form. Finally, the previous work is combined to complete the functionality.

## Review and clarify if necessary

Your commits are atomic, you've followed the project's standards, and you've arranged your commits in a logical order. The next step is to push your code up to the remote repository and review your pull request. I will usually save my pull request as [a draft on GitHub](https://github.blog/2019-02-14-introducing-draft-pull-requests/) at this stage.

After posting a draft pull request, step through each commit, look through the changes, and ask yourself if any potential areas could cause a reviewer to get tripped up. I recommend taking a break before so you can have fresh eyes.

If you find any trip hazards, add a comment to explain why you did what you did. If you can't explain why you did what you did, this is a good time to say so and ask for any suggestions. These comments give reviewers much-needed context to help inform the review.

## Listen to the reviewer

The final step to getting your pull request merged is listening to the reviewer. This can prove challenging sometimes, especially if the reviewer has difficulty communicating in a cordial manner (every team has that one dev...). Aim to receive and consider every comment with equal respect. 

Even if you disagree with the comment or request, there is always value in re-examining what you've written from someone else's perspective. That doesn't mean you should blindly do what the reviewer is suggesting. Sometimes it helps to get a second opinion. 

I have had to remind myself not to take each comment personally. In a discussion with [Chantastic](https://twitter.com/chantastic?lang=en) at a local meetup, he suggested to hold off replying to a review until you can start with "Thank you." This will help put you in the right frame of mind when responding to a particularly harsh review.

## In summary and summation

Creating helpful pull requests is a useful skill to develop, whether you're contributing to a team or open source software. Creating atomic, standards-based commits in a reasonable order and taking the review process seriously will get you a long way to getting that new feature merged.

If you'd like more information on how to make your pull requests the best they can be, check out the [Creative Commons PR guidelines](https://opensource.creativecommons.org/contributing-code/pr-guidelines/). And if you found this post helpful, please let me know by liking it over on DEV Community, and follow [me on Twitter](https://twitter.com/therealboone) for random thoughts and occasional blog updates.

Until next time!

[^standards]: True story. Did you know there are 15 different [outlet plug design standards](https://www.worldstandards.eu/electricity/plugs-and-sockets/) in use throughout the world today?

[^prs]: Let me assure you karma is a *thing*.
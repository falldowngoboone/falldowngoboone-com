---
title: How I solve complex problems
excerpt: |
  Solving complex problems is something every developer will do. This is my approach.
Publish Date: 2022-03-12
tags:
  - process
---

Developers are professional problem solvers. It’s the number one reason I became a developer. I am addicted to the feeling I get from solving problems, and there’s rarely a problem that I shy away from, much to my detriment.

Early on in my professional career, I took on stories that I thought were interesting problems to solve. Unfortunately, _I lacked a strong framework to help me deal with the complexity many of these stories presented._ The result was missed deadlines and overcomplicated solutions.

This is something I see in many developers starting out. _They want to solve big, interesting problems, but they haven’t developed the tools and the intuition necessary to do so in a timely, well-organized manner._ If you’re just starting out, I would encourage you to **develop a problem-solving framework that works for you.**

After my first performance review highlighted my issue with complex problems, I decided to be more intentional with how I approached problems. I developed a personal problem solving framework with the help of my manager, and have continued to refine it with the help of books and articles I’ve read, along with experience I’ve gained working with other developers.

My framework in summary is as follows:

1. Break the problem down
2. Hardest problem first
3. Work in intervals
4. If you get stuck, talk to a duck

Let’s examine these steps in more detail.

## Break the problem down

Complex problems can seem impossible to solve, but they’re really a string of simple problems tangled up in a knot. The first step to solving these complex problems is to **loosen the knot.** We can do that by attempting to pick out the simple problems we already know how to solve.

Given a customer’s cart, which consists of items with a `quantity` and a `price`, how would you determine the total cart price? One way of breaking this problem down would be:

1. Iterate through each cart item
2. For each item, multiply the `quantity` and `price`
3. Combine the item total of each result

A side effect of breaking problems down is you have effectively written psuedo-code that can translate directly to your solution:

```jsx
// iterate through each cart item
function iterate(items, callback) {
	for (let i = 0, l = items.length; i < l; i++) {
		callback(items[i])
	}
}

// for each item, multiply the quantity and price
function itemTotal({quantity, price}) {
	return quantity * price;
};

// combine the item total of each result
function combineTotals(totals) {
	return totals.reduce((a, b) => a + b);
}

// let's put it all together...
function cartTotal(items) {
	const totals = [];

	iterate(items, (item) => totals.push(itemTotal(item));

	return combineTotals(totals);
}
```

Granted, this may not be the most efficient to get a cart total, but it works. You can always work on optimizations once you have a working solution (but that’s for another article).

Maybe calculating a customer’s cart total isn’t a complex problem to you, but this same approach works for anything from sorting search results by relevance to [utilizing an API to build blog posts](https://www.falldowngoboone.com/blog/from-notion-to-eleventy-part-1-the-notion-api/) (shameless plug).

When breaking a problem down, I don't stop at my initial steps. **I evaluate my proposed solution with a series of questions:**

- _Can I solve each problem? If not, can I break these problems down even more?_
- _What assumptions am I making about this problem? Can I prove each assumption?_
- _Is there any risk associated with solving this problem? Am I touching shared code? Is there a solution where I don’t touch shared code?_
- _Is there a simpler way to break this problem down? Is this solution too complex?_

If I’m unsure about anything in the plan, I bring in another team member and walk them through the context. My current team is even experimenting with doing this as a team for stories of significant complexity. Many times different team members will have insight into areas of hidden complexity others may not be aware of.

## Hardest problem first

Once I have a plan together, I can start executing it, but not necessarily in the order it’s written. I prefer a testing technique I adapted from the excellent online course [*Learning How to Learn*](https://www.coursera.org/learn/learning-how-to-learn) that may seem counterintuitive.

**I start with what I believe is the most difficult problem,** get as far as I can as quickly as possible, and **when I can go no further, I tackle the easiest problem.** When that problem is done, I switch back to the difficult problem, get a bit further, then tackle the next-easiest problem if I hit another dead end. I repeat this process until all of the problems are solved.

The first reason to start with a hard problem then move to an easy one is it optimizes the total solution time. Switching to other problems and quickly knocking them out ensures **every step of the overall solution will have at least some work done,** even if I end up getting *really* stuck (more on that later).

This technique also optimizes brain power. According to *Learning How to Learn*, our brains have two basic modes of activity: a **focus mode,** where the brain focuses its raw power on a single thought, and a **diffuse mode,** where thoughts bounce all over the brain, connecting seemingly unrelated chunks of thought. Research has shown that the brain works best when _**switching between these two modes constantly.**_

Why is that? If you flex a muscle group as hard as you can for an extended period of time, it will fatigue, no matter how well-developed that muscle is. Your brain’s focus mode is like flexing a muscle. Switching to the diffuse mode is like resting that muscle. In addition to rest, the diffuse mode is also responsible for finding novel solutions to problems, which may help you solve your problem faster.

## Work in intervals

Switching to easier problems helps create space for the brain to rest, but we also need *actual* rest. I have ADHD, so my work habits swing wildly from completely unfocused to obsessive hyper-focus. Before I know it, five hours have blown by and I’m exhausted. The [Pomodoro Technique](https://francescocirillo.com/pages/pomodoro-technique) has been effective in lessening these wild swings and helping me focus on work in a healthy, balanced way.

Developed in the 1980s by Francesco Cirillo, the Pomodoro Technique calls for 25 minute blocks of focused, uninterrupted work followed by a short break. After completing four cycles of uninterrupted work, _take a longer break._ There’s a bit more to the technique itself, but at its core, **it’s about splitting deep work up into manageable blocks,** giving your mind the time to rest and maybe even explore alternative solutions.

What should you do during your break? I personally like to grab a coffee, a snack or work on a Sudoku. I’ve even taken up [Quordle](https://www.quordle.com/), which I find quite fascinating. Really anything I can do in a short amount of time that _distracts me from work._

If I feel like I’m losing momentum or discover a new issue that further complicates the problem, I will take some time before a new pomodoro to **reevaluate my strategy** (see the previous questions in Break the problem down). Sometimes, however, I find myself completely stuck. That leads me to my last problem-solving strategy.

## If you get stuck, talk to a duck

You may have heard of rubber ducking before. It comes from a story in the fantastic book *[The Pragmatic Programmer](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/)* (highly recommend) where a developer would carry around a rubber duck and explain their code to it line-by-line. I don’t have a rubber duck, but the concept has stuck with me ever since I first read that.

Many times I will **reiterate the problem to myself** or, much to her chagrin, my wife. Sometimes reiterating the problem at this stage can uncover things you missed in your initial definition of the problem itself, or you can get confirmation that you need someone else to check your work.

If I’m still stuck, I pull another developer into the conversation (if I paired with a developer on my initial strategy, I talk to that person). I explain the context of the problem and lead them line-by-line in what I’ve done so far. _I can’t tell you how many times a fellow developer’s question has unlocked a path to a solution._

It’s important to note that the quicker you get help, the quicker you’ll get to a solution. I tend to want to solve all the problems by myself, but sometimes that’s not possible. The lesson to learn here is **don’t let your ego stand between you and a solution.** Knowing when to ask for help is a mark of a mature developer (not that I’m consistent in this area).

## Conclusion

Solving complex problems is something every developer will do. A solid problem-solving framework can help you create better solutions within the tightest of deadlines. **Be intentional and leave your ego at the door.** The more you develop your framework, the more effective you’ll become.

Do you have a problem-solving framework? If so, [**I’d love to know what’s worked for you**](https://twitter.com/therealboone). I’m always interested in new approaches that could help me grow as a problem solver.

Until next time!
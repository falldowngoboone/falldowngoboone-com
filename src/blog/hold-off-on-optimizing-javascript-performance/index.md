---
title: Hold off on optimizing JavaScript performance
date: 2021-03-10
tags: 
  - career
  - javascript
  - process
---

As a developer, I love optimizing performance. Learning efficient algorithms makes me *feel* like a software engineer. But performance is not the only developer concern, nor should it be the first or second. [David K. Piano recently pointed this out on Twitter](https://twitter.com/DavidKPiano/status/1367855571077128196?s=20), offering up a suggested framework:

---

> Make it work<br/>
> Make it always work<br/>
> Make it work for everyone<br/>
> Make it right<br/>
> Make it fast

David's suggestion expands on a well-known [programming maxim attributed to Kent Beck](https://wiki.c2.com/?MakeItWorkMakeItRightMakeItFast), *Make it work, Make it right, Make it fast*. What does that mean? I want to take some time to expand on each layer.

## Make it work

Making working code is the first concern. This step may seem obvious, but there are a few things to consider as you make the code work.

First, consider a [test-driven development](https://www.agilealliance.org/glossary/tdd/#q=~(infinite~false~filters~(postType~(~'page~'post~'aa_book~'aa_event_session~'aa_experience_report~'aa_glossary~'aa_research_paper~'aa_video)~tags~(~'tdd))~searchTerm~'~sort~false~sortDirection~'asc~page~1)) approach. At the very least, wrap your code in tests as you write. This will make the rest of the process faster and ensure you don't break core functionality.

Second, don't worry about writing pretty code. If you find yourself debating what to name a variable, call it `thing1` and move on. Use formatting tools like [Prettier](https://prettier.io) to avoid thinking about white space and semicolons.

Finally, try to go fast here. You only need working code. If you hit a roadblock, start over. [Writing sloppy code](https://medium.com/swlh/coding-faster-make-it-work-then-make-it-good-6aa988ebd8ab) at the beginning can help you arrive faster at a better solution.

## Make it always work

Now we shift our attention to edge cases, cases involving less-common or unique data sets. These are the areas where bugs tend to show up. Here are some scenarios you might want to consider:

- No data
- A single piece of data
- The maximum amount of data
- One less than the maximum amount
- Bad (malformed) data

If your code involves asynchronous calls:

- Rejected promises
- A promise that never resolves
- Slow responses
- Immediate responses

Again, take the time to write tests. Whether you follow test-driven development or write tests after the fact, they will be invaluable as you move up the layers of concerns.

## Make it work for everyone

JavaScript is a funny language in that you can never be sure of the execution environment. Identify your feature's core functionality and make sure it works in a wide variety of browsers. Having a list of your code's official browser support helps in this step.

There are two approaches to supporting multiple environments: [progressive enhancement](https://www.smashingmagazine.com/2009/04/progressive-enhancement-what-it-is-and-how-to-use-it/) and [graceful degradation](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation). Both involve detecting feature support, but progressive enhancement adds functionality while graceful degradation removes functionality.

Both approaches are viable in different scenarios, and which you use depends on the context of the functionality.

## Make it right

The next layer of focus is making the code right. *Right* means making the code readable and maintainable. All of the tests written up to this point pay off by giving you confidence that functionality remains.

Developers read code much more than write it, so taking the time to make your code readable will help your colleagues and your future self. Readable code is more maintainable and extendable. The small cost of refactoring now can have an exponential impact on future project development.

Focus on small changes that make a noticeable impact. Use domain-specific variable names, ensure your functions are in the correct scope, use comments as indicators for creating functions. I recommend reading Martin Fowler's excellent book [Refactoring](https://www.amazon.com/Refactoring-Improving-Existing-Addison-Wesley-Signature/dp/0134757599/ref=pd_lpo_14_t_0/135-0301302-4311004?_encoding=UTF8&pd_rd_i=0134757599&pd_rd_r=b0b344db-197c-486e-844c-ca016c5ce3de&pd_rd_w=3V0TA&pd_rd_wg=3BK50&pf_rd_p=16b28406-aa34-451d-8a2e-b3930ada000c&pf_rd_r=S5WMMCDX49SEKYDQBFEN&psc=1&refRID=S5WMMCDX49SEKYDQBFEN) for more specific guidance and practical advice.

## Make it fast (if needed)

After we've made the code work, considered edge cases, added fallback support, and made the code readable, we finally optimize performance. Maybe.

The first rule from the [Rules of Optimization](https://wiki.c2.com/?RulesOfOptimization) is don't optimize. If you must optimize, however, there are a few things to keep in mind.

First, make sure you are testing production code. Many frameworks bolt-on functionality and tools that help the development process but hinder performance. Production builds exclude this extra functionality, so ensuring you are testing in the right environment keeps you from optimizing performance unnecessarily.

Next, you need to get baseline measurements. These will ensure that your optimizations worked. If possible, emulate slow internet connections and throttle CPU speed, two features [Chrome's devtools](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance) offers.

One thing to keep in mind as you optimize is how your optimizations may affect the readability and maintainability of code. Usually, the most optimized solution is nowhere near the most readable. Always favor readable code.

## Summary

Performance optimization makes sense to developers because it's something that's easily measured. Optimizing code may be a more attractive goal than finding edge cases or making code more readable but should be avoided until the end of the process. Optimizing at the very end forces developers to focus on writing working, maintainable code.

So, thanks for making it to the end! If you found this helpful, please let me know by liking this article on DEV Community and following me to know when I post a new article. And ask me all the questions you'd like (preferably about this article, but no judgment) on [Twitter](https://twitter.com/therealboone).

Until next time!
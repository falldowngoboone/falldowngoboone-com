# Brad Frost on how to use Storybook

Archived: No
Last Edited: February 18, 2022 3:47 PM
Status: Final Draft
Tags: components

Brad Frost recently appeared on the [new Storytime podcast](https://www.youtube.com/watch?v=jR0Gefa4lpg&t=1s) with Chantastic to talk about how he uses Storybook to build design systems. The show features a great discussion regarding how Frost’s [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) philosophy has been applied to the popular UI development tool. If you haven’t already, I highly recommend checking the episode out.

As a follow up to the discussion, Brad wrote a companion article that details [how he utilizes Storybook in design systems](https://bradfrost.com/blog/post/atomic-design-and-storybook/). This article was timely for me, as the team I work on is dealing with a crisis of faith regarding our Storybook implementation.

Long story short, building stories for our components has been somewhat complicated due to the complexities of our form system. Coupled with the lightning-fast rate we’ve been adding features to existing components, and our Storybook is lacking in-depth and up-to-date information.

Brad says in his article the he uses Storybook as the official design system, building components exclusively in Storybook, then packaging up the results in a bundle that’s then used as a project dependency. I think this approach would be a great solution to our team’s current lack of interest.

Of course, this approach slows UI development down, but I would argue that’s a good thing. I personally like to take it slow when creating shared components. Context is key to creating a health component API, and you need to use a component pattern several times before you understand everything that’s required.

I hope to have a follow up article about this in the future. I’m also planning a series on how I approach component API design and development, so give me a follow on Twitter and DEV Community if that sounds like something you’re interested in.

In the meantime, be sure to [watch the interview](https://www.youtube.com/watch?v=jR0Gefa4lpg&t=1s) and [read Brad’s article](https://bradfrost.com/blog/post/atomic-design-and-storybook/).
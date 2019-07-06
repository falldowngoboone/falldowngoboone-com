---
title: CSS is Hard
subtitle: What I've learned from an old codebase
date: '2019-07-05T00:33:32.166Z'
currentmood: utility-first
keywords:
  - css
---

The web app I work on is, by web standards, ancient. Since first committed to version control, it's seen developers come and go, ranging from those with a firm grasp on CSS best practices to those who, well, were probably amazing backend devs. The result is a spider web of stylesheets scattered across several pages and files.

It's important with any large web project to have a cohesive strategy to help manage the old and guide the new.

1. Have a plan
2. Write the plan down
3. Stick to the plan
4. Update the plan

## Have a plan

Sit down with all of your teammates and come up with a plan for your project's CSS. Make sure it _at least_ outlines the following:

### Tech stack

Need a CSS preprocessor? Sass is still a major force in this department. I still use it in older personal projects, but on newer projects, I've been reaching more and more for PostCSS. I personally like the idea of postcss-preset-env, a project that aims to empower front-end devs to use tomorrow's CSS today.

Is your project a single-page app that generates and manages the DOM via JavaScript? Perhaps you want to reach for a CSS-in-JS solution. I'm really digging Emotion right now, mostly because of the enormously convenient `css` prop and its ability to also produce styled components. CSS Modules are great if you want a more traditional approach but still like the idea of component-scoped styles.

### Core methodology

There are about as many CSS methodologies as there are opinions. BEM is a solid methodology, and it works great for projects with well-defined components and strong front-enders. ITCSS is a great approach as well. However, for larger projects, I am really liking the approachability of utility-first.

With a CSS-in-JS solution, you don't really need a methodology. One of the freeing things about dynamically scoping your styles is you can give your classes generic names and never have to worry about collisions. That being said, you may want to think about standardizing your naming scheme for organizational purposes.

### File organization

Where will your stylesheets live? For a traditional server-rendered site, you'll probably have a folder where all of your styles live. Maybe the methodology you chose provides a clear organization strategy.

In component-based apps, it may be easier to place the stylesheet files directly next to the component files.

## Write the plan down

We use DRs for decisions like this. Make sure you include why you're making this decision, what the decision is, and what the possible consequences will be (both good and bad).

## Stick to the plan

Make sure all new team members are directed to this plan. Remember to enforce these decisions when reviewing code.

Understand there will be exceptions. That's okay.

## Update the plan

Live with this strategy for a while before reviewing it. What's working? What's not?

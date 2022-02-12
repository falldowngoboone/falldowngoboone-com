---
title: The one where 'this' is undefined
date: 2022-02-12
excerpt: |
  Join me in my descent into madness as I troubleshoot `this`. And maybe, just maybe, we'll learn a bit about life. But mostly madness.
tags: 
  - javascript
---

I have been writing JavaScript since...well, let’s just say I was still watching new episodes of *Friends* on my un-flat CRT television. As long as I’ve worked with JavaScript, I *still* seem to forget the gotchas around the `this` keyword.

Recently I ran into a series of problems involving the `this` keyword while exploring the Notion API. I thought it’d be Fun™ to take a look at why those problems occurred and how I ultimately resolved them.

## The code

Notion’s API has a *notion* (see what I did there?) of content as blocks. To write a page out, you have to stitch together these blocks in a specific way. 

Each block has a different `type`, and each `type` is associated with a different handler. I built a class that takes an object of handlers keyed by these types and got this masterpiece:

```jsx
class Writer {
	#writers;

	constructor(writers) {
		this.#writers = writers;
  }

	write(block) {
		if (!block) return '';

		if (Array.isArray(block)) {
			return block.map(this.write).join('');
		}

		const { type } = block;
		const writer = this.#writers[type];

		return writer(block);
	}
}

const writer = new Writer({
	paragraph({ paragraph }) {
		const { text } = paragraph; // text here is actually an array of blocks

		return `<p>${this.write(text)}</p>`;
	},
	// ...more handlers...
	text({ text }) {
    const { link, content } = text;
    return link ? `<a href="${link.url}">${content}</a>` : content;
  }
})
```

Note that the block handlers passed into the `Writer` class can reference the `write` function directly. This is a convenience that allows handlers to forward nested block types to the writer for further processing. Neat!

Here’s my `Writer` class in action:

```jsx
readBlockChildren('7b9c0c66eebd47c6911ecd7f2defad6b') // A Notion API wrapper
  .then(writer.write)
  .then(console.log);
```

Looks harmless enough, except we get a nasty error when we run this code:

```text
			return block.map(this.write).join('');
                            ^

TypeError: Cannot read properties of undefined (reading 'write')
```

Well that’s rude! Apparently `this` is `undefined` inside of the `Writer#write` method.

After some investigation, I determined that the error happens right after the first `.then` call after reading the article blocks:

```jsx
readBlockChildren('7b9c0c66eebd47c6911ecd7f2defad6b')
  .then(writer.write) // I'm the problem. Hello!
  .then(console.log);
```

Notice I’m using a point-free style to pass my `write` method to `then`. I like it because it feels more terse. Don’t judge me.

We reference `this` inside of `writer.write()`. Normally, this wouldn’t be a problem, but passing `writer.write` point free removes the `writer` context, leaving `this` bound to the global context (which is `undefined` in strict-mode).

Here’s an illustration of the problem:

```jsx
class MyClass {
  getContext() {
		return this;
  }
}

const myClass = new MyClass();
const getContext = myClass.getContext;

myClass.getContext(); => MyClass {}
getContext(); => undefined
```

Passing the `write` method point-free is the equivalent of assigning it to a variable. No context. Whomp whomp.

Calling the method inside a callback fixes this particular issue.

```jsx
readBlocks()
	.then((block) => writer.write(block))
	.then(console.log)
```

The context is preserved and everyone gets a medal.

## A new challenger has appeared

Unfortunately, even though the context is preserved during the first call, running the code again yields this gem:

```text
		const writer = this.#writers[type];
                        ^

TypeError: Cannot read properties of undefined (reading '#writers')
```

The error suggests that `this` is once again `undefined`. This seems related to the last problem, but at a different spot. Some more investigation uncovers the location of the cause lies in how I handle arrays in the `write` method:

```jsx
write(block) {
	if (!block) return '';

	if (Array.isArray(block)) {
		return block.map(this.write).join(''); // here's the problem
	}

	const { type } = block;
	const writer = this.#writers[type];

	return writer(block);
}
```

Again, I’m using point-free style (I’m the worst), and again the context gets completely lost. The reason is slightly different now, though. `Array#map` is called with a callback, which by default binds `this` to `undefined`.

One solution is to nest the `write` method reference inside a callback like previously. There is one caveat: since we are referring to `this.write` and not a class instance (`writer.write`), an arrow function is required to maintain the *lexical*[lexical] `this` binding.

[lexical] *Lexical* is just a fancy way of saying the context of the surrounding scope at the time the scope is being defined, which in this case is the class instance. *Lexical* is also one of my favorite words. Say it with me: *lexical*.

```jsx
write(block) {
	if (!block) return '';

	if (Array.isArray(block)) {
		// this doesn't work
		// return block
    //    .map(function (child) {
    //      return this.write(child);
    //    })
    //    .join('');

		// this works
		return block.map((child) => this.write(child)).join('');
	}

	const { type } = block;
	const writer = this.#writers[type];

	return writer(block);
}
```

That’s definitely one way of fixing that problem, but a more interesting way is to use the second argument for `map`, which is the `thisArg`:

```jsx
write(block) {
	if (!block) return '';

	if (Array.isArray(block)) {
		// this works
		return block.map(this.write, this).join('');
	}

	const { type } = block;
	const writer = this.#writers[type];

	return writer(block);
}
```

Did you know `map` took a second argument? Yeah, it does. When we pass a `thisArg` to `map`, `this` is then bound to `thisArg` inside of the `map` callback. Huzzah!

## Another one

Now let’s run that beautiful code.

```text
		return `<p>${this.write(text)}</p>\n`;
                      ^

TypeError: Cannot read properties of undefined (reading 'write')
```

Okay, I quit.

Alright, I’m back. This is really a rollercoaster of emotion for me.

Same issue, different place. It seems like I’ve gotten really good at trying to read properties of `undefined`. But that’s okay, we will persevere!

After taking a closer look at the error, it seems like the issue is no longer occurring inside of the `write` method, which I believe to be a sign of progress. This time, the issue is inside a writer definition.

If you recall from a previous code block way back near the top of this article (who remembers that far back, anyway?), we pass a map of writers into the `Writer` class at initialization. These writer methods can *also* access the `write` method with `this` (or, at least that’s how I planned it; in practice they’re doing jack squat).

The writers need some way to write nested content, so `write` needs to be present somehow in the writer context.

```jsx
// a quick reminder of what the writers look like
const writers = {
	paragraph({ paragraph }) {
		const { text } = paragraph;

		return `<p>${this.write(text)}</p>`; // hey, here's a `this` reference
	},
	// ...more handlers...
	text({ text }) {
    const { link, content } = text;
    return link ? `<a href="${link.url}">${content}</a>` : content;
  }
}

// inside Writer
write(block) {
  if (!block) return '';

  if (Array.isArray(block)) {
    return block.map(this.write, this).join('');
  }

  const { type } = block;
  const writer = this.#writers[type]; // assignment!

  return writer(block);
}
```

We assign the writer function to a variable within the class’s `write` method, but this will not bind the instance context to `this` inside the writer methods. Why?

First of all, we’re doing that thing where we blow away context by assigning an instance method to a variable. D’oh!

Let’s call the method directly and see if that fixes things:

```jsx
write(block) {
  if (!block) return '';

  if (Array.isArray(block)) {
    return block.map(this.write, this).join('');
  }

  const { type } = block;

  return this.#writers[type](block); // writer called directly
}
```

We still get an error, but it’s a *new* error message.

```text
		return `&lt;p>${this.write(text)}&lt;/p>\n`;
                      	 ^

TypeError: this.write is not a function
```

This time `this` is defined (progress!), but `write` is not (bummer!). Chalk that up to a change in context.

The writers are functions defined in an object literal, so `this` refers to the surrounding object literal, not the parent class instance. If we want to keep the `this` references in the writer methods, we’ll need to bind the class instance to the method before calling it:

```jsx
write(block) {
  if (!block) return '';

  if (Array.isArray(block)) {
    return block.map(this.write, this).join('');
  }

  const { type } = block;
  const writer = this.#writers[type].bind(this);

  return writer(block);
}
```

The `bind` function method takes a `thisArg` as its first argument and binds that function’s `this` to that argument’s value (in the case of `null` or `undefined`, `this` defaults to the global execution context). Another interesting use of `bind` is partial application, but that’s a subject for another day.

The use of `bind` fixes our `this` problem completely, but it might be a bit confusing for other users. Passing the class instance method of `write` into the writer as a second argument might seem more reasonable:

```jsx
write(block) {
  if (!block) return '';

  if (Array.isArray(block)) {
    return block.map(this.write, this).join('');
  }

  const { type } = block;

	// remember to pass as an arrow function to preserve the current scope!
  return this.#writers[type](block, (block) => this.write(block));
}
```

We would then use this write method in the writers.

```jsx
const writers = {
	paragraph({ paragraph }, write) { // write method injected as an argument
		const { text } = paragraph;

		return `<p>${write(text)}</p>`; // works!
	},
	text({ text }) { // if you don't need the `write` method, don't use it!
    const { link, content } = text;
    return link ? `<a href="${link.url}">${content}</a>` : content;
  }
}
```

## Making peace with `this`

The code works now. Hurray! Looks like I *won’t* be quitting tech, moving to a large, unincorporated rural area and starting my own country in a prepper basement. Today.

When I started working with JavaScript at an unspecified date in the past, `this` was one of the most confusing concepts to me. So confusing, in fact, that I avoided it like the plague.

Thankfully there are tons of great resources available to shed light on `this`. One of the most helpful resources was Kyle Simpson’s excellent *You Don’t Know JS* series, especially *[this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/this%20&%20object%20prototypes/README.md#you-dont-know-js-this--object-prototypes)*. I consumed that book, as well as several other resources (shout out to Frontend Masters!), and `this` became less confusing to me, and now I use it all over the place (to my own detriment, apparently).

I guess the point I’m trying to make is not to use `this` in your every day code; it’s to make peace with the parts of programming that confuse, frustrate, or even frighten you. Understanding core concepts of your programming language of choice empowers you and gives you a better toolset to troubleshoot annoying errors.

Do you love `this`? Do you wish `this` was never included in JavaScript? Even more important, do you have a better pattern for unwinding Notion blocks? [Let’s discuss on Twitter](https://twitter.com/therealboone).

Until next week!
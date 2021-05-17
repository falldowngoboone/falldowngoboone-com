---
title: Misadventures in web components
lede: Exploring progressively enhanced form web components
date: 2021-05-16
tags: 
  - a11y
  - javascript
  - progressive enhancement
---

I have been thinking about [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) a lot lately, and I wanted to see how we could start using them at [The Container Store](https://www.containerstore.com/welcome.htm). The idea was to pick a simple component and recreate it as a web component, and the first candidate that came to mind is our frequently-used quantity stepper. The stepper appears in several places throughout the website, and it's dependent on an embarrassing amount of jQuery.

Here's my humble first attempt:

{% codepen 'xxgMEax' %}

The result isn't perfect, but I gained a better understanding of web components, their limitations, and where they're useful.

## Lessons learned

My ultimate goal was to create a web component that progressively enhanced from a run-of-the-mill number input to a custom element. I also wanted to explore the limitations of web components inside a form. What I ended up with was this weird solution that sidesteps the shadow DOM altogether.

### Progressive enhancement...sort of

The experimental component requires a donor number `input`, either as a child of `my-stepper` or, my preference, via a `data-is` attribute on a native `input[type=number]`. This is my naive version of [customized built-ins](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#customized_built-in_elements), which I suspect would be perfect for this particular situation.

The reason for the hand-rolled functionality is because [Safari doesn't support customized built-ins](https://github.com/WICG/webcomponents/issues/509#issuecomment-230700060), nor do they intend to anytime soon[^liskov]. I will probably swap out my custom `data` attribute solution for a [polyfill that supports the native `is` attribute](https://github.com/ungap/custom-elements) when implementing in production because this is not implemented to spec.

[^liskov]: Safari engineers argue that customized built-ins violate the [Liskov substitution principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle). Given the fact that this custom stepper will only support an `input[type=number]`, I believe they're probably right. But also, `HTMLInputeElement` is the element API equivalent of a dumpster fire.

The `my-stepper`'s template inserts child content in between two `button`s wired up with click listeners. The listeners increment or decrement the value of the `input` (if present). The interesting thing about template `slot`s is their content remains in the light DOM, making them completely accessible to the parent form.

The result ensures that the input remains an input if JavaScript is disabled or (more than likely) takes a while to load, parse and execute[^pe].

[^pe]: Yes, the site should just run faster, I agree. Baby steps. And in an ideal world, we would pre-render shadow DOM on the server and hydrate it client-side. Currently, shadow DOM is imperative-only, so there's no way to render on the server, but there is a proposal for declarative shadow DOM, something I hope to write about soon.

### Native form functionality

The shadow DOM encapsulates style and markup, but that comes at the cost of accessing field data in form field web components. Shadow DOM field values aren't registered in `form.elements` and shadow fields cannot participate in the form lifecycle (e.g. field validation) by default.

If you need to access field values, you can [use a hidden input](https://www.hjorthhansen.dev/shadow-dom-form-participation/) or [listen for the `formdata` event on the parent form](https://web.dev/more-capable-form-controls/). Both strategies ensure you can pass data properly on submit, but neither will give you full access to the form lifecycle.

The [`ElementInternals`](https://html.spec.whatwg.org/multipage/custom-elements.html#element-internals) interface, however, officially grants web components access to the lifecycle of a parent form, including methods to determine the field's value and validity:

```jsx
class MyElement extends HTMLElement {
  constructor() {
    this.internals = this.attachInternals();
    // use internals to set the form field value, 
    // determine valid data, etc.
  }
}
```

In addition to gaining access to the form lifecycle, the `ElementInternals` specification grants access to the [accessibility object model](https://html.spec.whatwg.org/multipage/custom-elements.html#accessibility-semantics). [Only Chrome and Chromium-based browsers](https://caniuse.com/?search=attachinternals) support internals at the time of this writing, but, again, there are polyfills.

### Accessibility

I learned that elements within the shadow DOM will still receive focus and are properly announced via a screen reader out-of-the-box (curiously, VoiceOver announces shadow DOM barriers as a new frame, at least at the time of this writing). I guess it acts sort of like an `iframe` in that respect?

One concern I had, though, was how to reference an ID in the shadow DOM with a `label` in the light DOM. Unfortunately, shadow DOM ID reference is not possible, at least not natively. There have been discussions about somehow [delegating labels via an option passed to `attachShadow`](https://github.com/whatwg/html/issues/3219), but I haven't seen anything regarding implementation.

The only thing I found that works with the shadow DOM is determining the input's label(s)[^multiple], then adding click listeners to each that imperatively focus the shadow DOM target:

```javascript
const template = document.createElement('template');

template.innerHTML = `
<input name="name" />
`

class MyInput extends HTMLElement {
  static get formAssociated() {
    return true;
  }
  
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.append(template.content.cloneNode(true));
    this.internals = this.attachInternals?.() || {};
  }
  
  connectedCallback() {
    this.internals.labels?.forEach((label) => {
      console.log(label)
      label.addEventListener('click', () => {
        this.shadowRoot.querySelector('input')?.focus();
      });
    });
  }
}

customElements.define('my-input', MyInput);
```

[^multiple]: Remember, labelable elements can have more than one label.

Hey, check it out, we're exercising the `ElementInternals` API! That didn't take long.

Note that we have to first specify that an element is form-associated with the `formAssociated` static property, then we can access the form-related internals. Also, note that we have to attach the click listeners in the `connectedCallback` method instead of the constructor (which is what I attempted at first)[^connected]. Form association only happens after the element has attached to the DOM, so `this.internals.labels` is `null` in the constructor.

[^connected]: It's a good idea to always run your side effects like attaching listeners inside `connectedCallback`, even if you have access in the constructor. And make sure you clean up any listeners in the `disconnectedCallback` method. See the resources section for a link to web component best practices.

### Styling

There are [several ways to customize web component styles](https://css-tricks.com/styling-web-components/). For this experiment, I'm opening up custom styling via shadow parts and the [`::part()` CSS pseudo-element](https://developer.mozilla.org/en-US/docs/Web/CSS/::part). I think this strategy works for this particular instance since there are only three pieces that need to be styled: the two buttons and the wrapper. 

The `::part()` pseudo-element takes an identifier that is assigned with the `part` attribute:

```html
<button part="decrement control">&minus;</button>
  <slot>CHILD CONTENT</slot>
<button part="increment control">+</button>
```

```css
my-stepper::part(control) {
  /* styles here */
}
```

Note that you can pass multiple identifiers to `part`. I'm using this feature to allow consumers to style both buttons with the `control` shadow part and the individual buttons with their respective shadow parts.

Shadow parts may not scale that well with more complex elements, and I haven't tested how they would work on child web components (web components nested in a web component shadow DOM).

## Final thoughts

As I mentioned earlier, I think the next step is to redo this component as a customized built-in and let a [polyfill](https://github.com/ungap/custom-elements) or library do all the heavy lifting. I'm curious to see what role, if any, shadow DOM plays in that particular type of web component.

I'm also interested in exploring [LitElement](https://lit.dev) and [Stencil.js](https://stenciljs.com), particularly how they would integrate with our current stack. My ultimate goal is to make web component creation as easy and gotcha-free as possible, and libraries help normalize some of the weirdness you may get with a low-level API like web components.

I had a ton of fun messing around with web components, and I learned a lot as well. If you found this helpful or have something you'd like me to write about, let me know. I enjoy doing these experiments and hope to deep dive even more into web components in the future.

Until next time!

## Resources

- More on web components and the accessibility object model: [https://www.24a11y.com/2019/web-components-and-the-aom/](https://www.24a11y.com/2019/web-components-and-the-aom/)
- Best practices: [https://developers.google.com/web/fundamentals/web-components/best-practices](https://developers.google.com/web/fundamentals/web-components/best-practices)
- Follow the latest in web components: [https://www.webcomponents.org](https://www.webcomponents.org/)
- A nice overview of web component criticism: [https://blog.logrocket.com/what-happened-to-web-components/](https://blog.logrocket.com/what-happened-to-web-components/)
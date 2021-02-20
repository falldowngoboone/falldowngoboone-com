---
title: How to avoid premature abstractions in React
date: 2021-02-19
tags: 
  - blogruary
  - programming
  - react
---

As a junior developer, my number one problem was creating premature abstractions. Nowhere was this more evident than my React components.

## It started with an input

I worked on a large project involving several form elements, so as part of bootstrapping on top of Create React App, I created some form components that wrapped around [Formik](https://formik.org/). Here's what the `Input` element looked like in use:

```jsx
<Input label="Full Name" name="username" id="username" />
```

The `label`, `name`, and `id` were all required, which was something I thought was clever to ensure proper input labeling. This component also automatically tied into Formik's form validation and dynamically generated field errors when data was invalid.

## Then the tooltips showed up

I had abstracted away all the complexity into a simple, useful API. I thought this was all we would need. But then a new design came through that required a tooltip to render inline with an input label.

I wanted to keep the interface simple, so I added a `tooltip` component set to a string, which would become the child element of a `Tooltip` component alongside the label.

```jsx
<Input 
  label="Cell Phone"
  tooltip="This is required for receiving texts."
  name="phone"
  id="phone"
  type="tel"
/>
```

Not that great, but it still looks manageable. But the variations kept coming. Some inputs needed a visible message. Others needed a special icon by the label. 

## Enter render props

I decided the best way to handle all these use cases was to extend the `label` prop to receive [render props](https://reactjs.org/docs/render-props.html):

```jsx
<Input 
  label={({Label, labelProps}) => (
    <div>
      <Label {...labelProps}>Cell Phone</Label>{" "}
      <Tooltip>This is required for receiving texts.</Tooltip>
      <p>Cell phones are great, right?</p>
    </div>
  )}
  name="phone"
  id="phone"
  type="tel"
/>
```

Okay, not as simple as what we started with, but *probably* maintainable? Then I got even more variations in, this time around the input itself. Designs were calling for an inline icon, a separate button, dynamic images...so I made the input itself a render prop.

```jsx
<Input 
  label={({Label, labelProps}) => (
    <div>
      <Label {...labelProps}>Cell Phone</Label>{" "}
      <Tooltip>This is required for receiving texts.</Tooltip>
      <p>Cell phones are great, right?</p>
    </div>
  )}
  name="phone"
  id="phone"
  type="tel"
>{({Input, inputProps, InputGroup, inputGroupProps}) => (
  <InputGroup {...inputGroupProps}>
    <Input {...inputGroupProps} />
    <IconButton variant="phone" />
  </InputGroup>
)}</Input>
```

I get panic sweats just looking at that. What is it? Why are there two types of `Input`? And what is the flow of props? This is not maintainable; it's barely readable, especially when surrounded by more of these monstrosities!

The example above is a small sample of the horror show this component became. It also had support for checkboxes and buttons. And as terrible as the API looked, the component's code looked indecipherable. I'm not posting it here for fear of losing my developer card.

## Walking back the design

If I had to do it all over again, I would've put off making a shared input component. Isolating components allows more real-world use cases to organically develop, leading to a better-informed API.

I've since realized it's much better to break up components into their atomic parts, which allows for more flexibility and composability. What do I mean by atomic? Something like this:

```jsx
<Field name="username">
  <Label>Full Name</Label>
  <TextInput />
  <FieldMessage />
</Field>
```

I've pulled all the field data out into a `Field` component, which uses context to build and pass all the necessary information into its children. The children themselves can either utilize the data passed in via a custom `useField` hook, or fallback to explicit props.

Granted, it's not as elegant as the original, But it's more composable. I can now easily rearrange the elements of the input field without render prop soup (e.g., move the `FieldMessage` above the `TextInput`). And by using dynamically generated IDs and context, I can forgo the requirement of an explicit ID as well.

The only downside to this is requiring a label becomes trickier. I could probably work out a solution by expecting a label ref to be passed through context, or I could just leave it and see if it's a real problem to be solved. 

And if you still want that nice, elegant API from the very beginning, you could do something like this:

```jsx
function TextField({name, label}) {
  return (
    <Field name=(name)>
      <Label>{label}</Label>
      <TextInput />
      <FieldMessage />
    </Field>
  )
}

// <TextField label="Full Name" name="username" />
```

## How to avoid this

The answer to avoiding premature abstraction is simple: don't create abstractions until there is a need. Need is a relative term, but a good, solid rule to follow is don't abstract duplicated code until you have found at least three instances of duplication. This is known as [the Rule of Three](https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming)).

In React, components are abstractions, so you should hold off *sharing* a component until there are similar components in three different places. Note that you can, and should, still create private components. It's a great way to keep duplicated code visible, as well as good practice for fine-tuning the component's API.

## What now?

If you'd like to learn more about the dangers of premature abstraction, I highly recommend watching Dan Abramov's *[The Wet Codebase](https://www.deconstructconf.com/2019/dan-abramov-the-wet-codebase)* talk from Deconstruct 2019. And if you liked this article, please consider liking it on Dev Community, and follow me on Twitter to receive updates.

Until next time!
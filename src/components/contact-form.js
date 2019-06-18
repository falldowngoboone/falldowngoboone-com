import React from 'react';

export default function ContactForm() {
  return (
    <form action="/">
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" />
      </div>
      <div>
        <label htmlFor="message">Your Message</label>
        <textarea id="message" name="message"></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

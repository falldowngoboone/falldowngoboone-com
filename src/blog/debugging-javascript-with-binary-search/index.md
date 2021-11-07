---
title: Debugging JavaScript with binary search
date: 2021-02-05
tags: 
  - blogruary
  - javascript
  - process
---

I recently had to debug a problem that existed somewhere in the middle of around 460 lines of JavaScript spaghetti. Debugging was useless because the bug was taking down dev tools! The approach I took was something that I often employ when facing a seemingly impossible task like this.

---

First, let me pull up a chair, sit down in it backwards and type out some words about [binary search](https://www.khanacademy.org/computing/computer-science/algorithms/binary-search/a/binary-search). It's a search pattern that utilizes a divide and conquer algorithm to locate data. 

Let's say you need to look up something located in a huge heap of sorted data. Oh, maybe you're looking up a friend's phone number in a phone book (I mean, not like I ever had to do that in my lifetime...).

Anyway, you need to find a friend's number, so the first thing you do is open the phone book to the very middle. Is your friend's last name on the page? Chances are it's not. Since you know the alphabet, you know whether your friend's last name comes before or after the page you're on.

Now this is an important point. Let's say your friend's last name comes before the page you're on. In binary search, **you throw away the data you know doesn't contain what you're looking for.** This leaves you with half the data to search through.

Now you do the same steps over and over, dividing the data, checking where you are, and throwing away the half that doesn't contain what you're looking for. This algorithm is simple and elegantly fast (a worst-case [time complexity](https://www.geeksforgeeks.org/understanding-time-complexity-simple-examples/) of O(log n), which in plain speak means it remains fast the bigger the dataset you have to search).

So why did I just blow through five paragraphs on binary search? What was I talking about? Oh, right, debugging.

To debug this particular problem, I first commented out the entire block of code as a sanity check, then checked to make sure the bug was no longer occurring (setting up a quick [feedback loop](https://www.falldowngoboone.com/blog/the-feedback-loop/) is crucial to debugging). 

After confirming I had indeed isolated the bug, I commented out the bottom half of the 460 line code block (I always skip commenting out top level function declarations to avoid runtime exceptions that could give me a false positive). A save and refresh showed the bug was still alive and well. I continued to do this until the bug no longer triggered.

After I isolated the bug to a range of lines, I uncommented everything else, saved, and double-checked my work. After confirming the cause was definitely in the last chunk of code I commented out, it was a matter of doing the binary comment-out-and-save on those remaining lines.

I found the source of the bug in about an hour, which is pretty good considering it takes about 30 minutes to deploy the code to our testing environment. Yeah, that's a topic for another post.

I have been told that repetition helps learning, so let's do that now. To review:

1. Set up a feedback loop
2. Confirm the code you are editing is indeed the problem
3. Starting from the bottom, comment out half the code, save and refresh
4. If the bug remains, repeat Step 3 until the bug is squished; now you know where the bug exists (make sure you double check your work by uncommenting everything but the isolated block of code)

I've used this for layout overflow issues as well ([CSS is awesome](https://css-tricks.com/css-is-awesome/)), by deleting huge chunks of a web page in dev tools. It's an effective, if dirty, solution.

Sometimes I like using the debugger. Sometimes it's the good ol' `console.log`. But when all else fails, I get out the knife and start carving up code.

How do you debug your code? [Let me know](https://twitter.com/therealboone) and I'll be your best friend. And I am a very good friend.

Till tomorrow...
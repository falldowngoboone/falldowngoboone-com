---
title: The Feedback Loop
blurb: Getting feedback fast is one of the most important things in development
date: 2019-09-29
currentmood: Loopy
tags:
  - development
---

Getting feedback fast is one of the most important things in development. What do I mean about feedback?

Let's imagine playing a video game. You have a console, a controller, and a screen. If you press left on the controller's d-pad, your character walks to the left on the screen. If you press right on the d-pad, your character walks right. Makes sense, right?

Of course, if you've ever used a sketch online video game service, you may be familiar with lag. Maybe you press right on your d-pad and your character waits a split second before walking to the right. Not terrible lag, but enough to notice. Maybe the lag's even worse. Maybe you press right and nothing happens, then you press left and your character walks to the right. This is arguably not only going to affect your game, but also how you perceive the game.

In video games, you're used to immediate feedback. What you input into the controller gets translated immediately (at least perceptively) to the screen. This is one of the fundamental reasons certain video games are easy to pick up and learn. Any lag in this feedback loop makes learning incredibly difficult and frustrating.

Now, instead of a screen and a controller, imagine a text editor and an open browser. It doesn't take too much of an imagination to see the same rule applies to development.

When I start a new project, the first thing I do is figure out how to establish a feedback loop. A good example of this is a project I'm currently working on. It involves consuming a SOAP service and marshalling the responses to Java objects so they are ultimately expressed as JSON to a JavaScript front end. You may have no idea what some of that means (at the beginning of last week, I didn't either), but that's why establishing a feedback loop early is so important. The more direct and immediate the feedback, the more confidence I can have in my experimentation with the code.

The way I established a feedback loop in this case was to create a REST-ful endpoint on the Java app where I could `GET` arbitrary information. Then, after rigorous (and tedious) configuration on the SOAP service part, I began retrieving information and printing it to the screen.

Is this the best feedback loop? Maybe, maybe not. The point is, it's good enough for now. The more I work on this project, the better (hopefully) my feedback loop will get.

Good feedback loops are important. If you're new to coding, work on establishing a good feedback loop immediately. Learn to identify when you need more information, then learn how to get that information. Maybe it's a well-placed `console.log`. Maybe it's dumping the contents of an object to the screen. Whatever it is, make sure it gives you the most direct information in the quickest way possible.

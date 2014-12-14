---
title: On Tight Feedback Loops
layout: post
---

*"How can I be a more productive programmer?"*

I was asked this question at work last week. It has many answers,
ranging from gospel truth to pure bullshit. Here is my attempt
at a generic response that hopefully leans toward the truthful end
of the spectrum:

Build a tight feedback loop.

On a second-by-second level, a tight feedback loop helps developers build a state of
[flow][flow]. In the best of times, I know what I want to build; I am
immersed in my code. And whenever necessary, I can quickly test my
ideas, absorb the results, adjust my approach
and return to the code without ever breaking a chain of thought.
This is the ideal. When you're in a state of flow (a.k.a. THE ZONE),
coding is fast and fun as hell.

Building a state of flow requires skill and desire (these are learned with practice,
so you are on your own there) but also great tools. Great tools do their job
before you slip out of the zone. The bad ones are easily identified, as they
are the subject of many a curse word.

Every programming discipline has it's own set of tools. Find the ones that work
for you. Web developers might need fast asset compilers while
micro-optimizers might need a fast, realistic benchmark suite. Fast unit tests
and fast compilers are nice for everybody. If you're operating in a large
code base, ensure your tools can operate on the smallest subset necessary, to
keep your build/test/run latencies as low as possible.

Building tight feedback loops is important in higher level views of
programming as well. In systems and product design, critical decisions need to be
(re-)evaluated as early as possible and as often as necessary. This ensures
while we are heads down working (hopefully in THE ZONE), we're building the right things and
correct course when we are not.

[flow]: http://en.wikipedia.org/wiki/Flow_%28psychology%29

---
title: About
---

There are situations where we want to use a language like Go to build tooling that needs some performance. Therefore, the distribution of a binary written in another language might be hard for folks that are not familiar to that language.

Like you or not, NodeJS (or any JS runtime) is been used for various kind projects, needless to say, the JS community is one of the largest in the world of development, meaning that those developers probably know how to install a global npm package, which makes the distribution easier and more accessible than "asking to install a binary from somewhere".

The main issue here is that we need a glue between a Go project and its ways of building and publishing vs. a JavaScript/NodeJS package ways of publishing.

Another huge pain point is to distribute the right package. When we build a Go app/tool, we need to specify the ARCH and the OS, which by default is the one we're, but that might not be the same one from the user.

This library attempts to solve this issue using technologies from 2024.

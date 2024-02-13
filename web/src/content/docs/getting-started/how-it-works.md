---
title: How it works
description: The overall idea of how it works
---

The concept here is the following:

1. You have your CLI/tool in Go
1. You publish to Github/Gitlab or whatever platform where it can be reached via HTTP using Goreleaser <!-- Link --> (this will create binaries from a wide range of platforms)
1. You create either a separate package (or in the same repo) a package.json that contains basic information and some instructions about how to fetch your package
1. You create a simple `bin.js` file that will call your binary
1. You add `go-npm2` as dependency, and add it as `postscript`. It'll use all the information in your package.json + the user OS and ARCH to download the right binary.

Once the user install globally (or locally) the package, a the `postscript` npm script will run, fetch the binary, save it in the folder you've specified. When the user invokes the bin command (defined in the package.json) of your package, the JS file will call your binary and it'll be executed.

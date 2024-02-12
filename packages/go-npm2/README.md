# go-npm2

Publishing your Go binary via NPM made easy.

## About

There are situations where we want to use a language like Go to build tooling that needs some performance. Therefore, the distribution of a binary written in another language might be hard for folks that are not familiar to that language.

Like you or not, NodeJS (or any JS runtime) is been used for various kind projects, needless to say, the JS community is one of the largest in the world of development, meaning that those developers probably know how to install a global npm package, which makes the distribution easier and more accessible than "asking to install a binary from somewhere".

The main issue here is that we need a glue between a Go project and its ways of building and publishing vs. a JavaScript/NodeJS package ways of publishing.

Another huge pain point is to distribute the right package. When we build a Go app/tool, we need to specify the ARCH and the OS, which by default is the one we're, but that might not be the same one from the user.

This library attempts to solve this issue using technologies from 2024.

## Inspiration

This project is an enhancement of [go-npm](), a project that attempts to solve this issue but which is no longer being maintained (last commit was 7 years ago) and doesn't cover the modern aspect of publishing a JS package, specially when it comes with the variarity of package managers (pnpm, bun, yarn, npm, deno, etc.).

So, I grasp the idea (which is totally correct) and cut some phases based on projects that do that like Biome<!-- Link to -->, SWC <!-- Link -->, Turbo <!-- Link -->.

## How it works

The concept here is the following:

1. You have your CLI/tool in Go
1. You publish to Github/Gitlab or whatever platform where it can be reached via HTTP using Goreleaser <!-- Link --> (this will create binaries from a wide range of platforms)
1. You create either a separate package (or in the same repo) a package.json that contains basic information and some instructions about how to fetch your package
1. You create a simple `bin.js` file that will call your binary
1. You add `go-npm2` as dependency, and add it as `postscript`. It'll use all the information in your package.json + the user OS and ARCH to download the right binary.

Once the user install globally (or locally) the package, a the `postscript` npm script will run, fetch the binary, save it in the folder you've specified. When the user invokes the bin command (defined in the package.json) of your package, the JS file will call your binary and it'll be executed.

## Guide

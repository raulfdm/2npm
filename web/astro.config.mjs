import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  redirects: {
    "/": {
      status: 302,
      destination: "/getting-started",
    },
  },
  integrations: [
    starlight({
      title: "go-npm2",
      social: {
        github: "https://github.com/raulfdm/go-npm2",
      },
      sidebar: [
        {
          label: "Start Here",
          items: [
            { label: "Getting Started", link: "/getting-started" },
            { label: "About", link: "/getting-started/about" },
            { label: "Inspiration", link: "/getting-started/inspiration" },
            { label: "How it works", link: "/getting-started/how-it-works" },
          ],
        },
        {
          label: "Guide",
          items: [
            { label: "Pre-requisites", link: "/guides/pre-requites" },
            { label: "Go Package", link: "/guides/go-package" },
            { label: "Go Release", link: "/guides/go-release" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});

import { defineConfig } from "vite";

import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [dts()],
	build: {
		ssr: true,
		target: "node18",
		lib: {
			entry: {
				index: "./src/index.ts",
				legacy: "./src/legacy.ts",
			},
			formats: ["es"],
		},
	},
});

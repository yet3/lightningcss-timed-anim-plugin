import { svelte } from "@sveltejs/vite-plugin-svelte";
import browserslist from "browserslist";
import { browserslistToTargets, composeVisitors } from "lightningcss";
import { defineConfig } from "vite";
import timedAnim from "../dist";

// https://vite.dev/config/
export default defineConfig({
	plugins: [svelte()],

	css: {
		transformer: "lightningcss",
		lightningcss: {
			targets: browserslistToTargets(browserslist(">= 0.25%")),
			customAtRules: {
				...timedAnim.customAtRules,
			},
			//
			visitor: composeVisitors([timedAnim.visitor()]),
		},
	},

	build: {
		cssMinify: "lightningcss",
	},
});

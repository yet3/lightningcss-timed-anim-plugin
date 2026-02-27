import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
	plugins: [tsconfigPaths(), dts({ rollupTypes: true })],
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "LightningcssTimedAnimPlugin",
			fileName: "index",
			formats: ["es", "umd", "cjs"],
		},
	},
});

import { transform } from "lightningcss";
import { describe, expect, test } from "vitest";
import timedAnim from "$src";
import type { IConfig } from "$utils/config";

describe("anim: @use-step", () => {
	const pluginConfig: IConfig = { vendorPrefix: "none" };

	test("multiple steps (no wait)", () => {
		const res = transform({
			filename: "test.css",
			minify: true,
			code: Buffer.from(`
      @anim-step step-1 {
        background-color: red;
      }
      @anim-step step-2 {
        background-color: blue;
      }
      @anim anim-name {
        @use-step step-1, 1s;
        @use-step step-2, 0.5s;
        @use-step step-1, 1s;
      }
    `),
			customAtRules: {
				...timedAnim.customAtRules,
			},
			visitor: timedAnim.visitor(pluginConfig),
		});

		expect(res.code.toString()).toBe(
			":root{--duration-anim-name:2.5s}@keyframes anim-name{40%{background-color:red}60%{background-color:#00f}to{background-color:red}}",
		);
	});

	test("multiple steps (no wait)", () => {
		const res = transform({
			filename: "test.css",
			minify: true,
			code: Buffer.from(`
      @anim-step step-1 {
        background-color: red;
      }
      @anim-step step-2 {
        background-color: blue;
      }
      @anim anim-name {
        @use-step step-1, 1s, 0.5s;
        @use-step step-2, 0.5s;
        @use-step step-1, 1s, 2s;
      }
    `),
			customAtRules: {
				...timedAnim.customAtRules,
			},
			visitor: timedAnim.visitor(pluginConfig),
		});

		expect(res.code.toString()).toBe(
			":root{--duration-anim-name:5s}@keyframes anim-name{20%{background-color:red}30%{background-color:red}40%{background-color:#00f}60%{background-color:red}to{background-color:red}}",
		);
	});
});

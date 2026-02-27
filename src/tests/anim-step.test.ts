import { transform } from "lightningcss";
import { describe, expect, test } from "vitest";
import timedAnim from "$src";
import type { IConfig } from "$utils/config";

describe("anim: @step", () => {
	const pluginConfig: IConfig = { vendorPrefix: "none" };

	test("single step (no wait)", () => {
		const res = transform({
			filename: "test.css",
			minify: true,
			code: Buffer.from(`
      @anim anim-name {
        @step 1s {
          background-color: red;
          opacity: 1;
        }
      }
    `),
			customAtRules: {
				...timedAnim.customAtRules,
			},
			visitor: timedAnim.visitor(pluginConfig),
		});

		expect(res.code.toString()).toBe(
			":root{--duration-anim-name:1s}@keyframes anim-name{to{opacity:1;background-color:red}}",
		);
	});

	test("multiple steps (no wait)", () => {
		const res = transform({
			filename: "test.css",
			minify: true,
			code: Buffer.from(`
    @anim anim-name {
      @step 1s {
        background-color: red;
        opacity: 1;
      }
      @step 0.5s {
        background-color: blue;
        opacity: 0;
      }
      @step 1.5s {
        background-color: cyan;
        opacity: 1;
      }
    }
    `),
			customAtRules: {
				...timedAnim.customAtRules,
			},
			visitor: timedAnim.visitor(pluginConfig),
		});

		expect(res.code.toString()).toBe(
			":root{--duration-anim-name:3s}@keyframes anim-name{33.3333%{opacity:1;background-color:red}50%{opacity:0;background-color:#00f}to{opacity:1;background-color:#0ff}}",
		);
	});

	test("single step with wait", () => {
		const res = transform({
			filename: "test.css",
			minify: true,
			code: Buffer.from(`
    @anim anim-name {
      @step 1s, 2s {
        background-color: red;
        opacity: 1;
      }
    }
    `),
			customAtRules: {
				...timedAnim.customAtRules,
			},
			visitor: timedAnim.visitor(pluginConfig),
		});

		expect(res.code.toString()).toBe(
			":root{--duration-anim-name:3s}@keyframes anim-name{33.3333%{opacity:1;background-color:red}to{opacity:1;background-color:red}}",
		);
	});

	test("fail on singular 0s step with no wait", () => {
		expect(() =>
			transform({
				filename: "test.css",
				minify: true,
				code: Buffer.from(`
    @anim anim-name {
      @step 0s {
        background-color: red;
        opacity: 1;
      }
    }
    `),
				customAtRules: {
					...timedAnim.customAtRules,
				},
				visitor: timedAnim.visitor(pluginConfig),
			}),
		).toThrow();
	});

	test("single 0s step with 1s wait", () => {
		const res = transform({
			filename: "test.css",
			minify: true,
			code: Buffer.from(`
    @anim anim-name {
      @step 0s, 1s {
        background-color: red;
        opacity: 1;
      }
    }
    `),
			customAtRules: {
				...timedAnim.customAtRules,
			},
			visitor: timedAnim.visitor(pluginConfig),
		});

		expect(res.code.toString()).toBe(
			":root{--duration-anim-name:1s}@keyframes anim-name{0%{opacity:1;background-color:red}to{opacity:1;background-color:red}}",
		);
	});

	test("steps (1st & 3rd 0s) and waits", () => {
		const res = transform({
			filename: "test.css",
			minify: true,
			code: Buffer.from(`
    @anim anim-name {
      @step 0s, 1s {
        background-color: red;
      }
      @step 2.5s  {
        background-color: cyan;
      }
      @step 0s, 1s  {
        background-color: purple;
      }
      @step 0.75s, 3s  {
        background-color: pink;
      }
    }
    `),
			customAtRules: {
				...timedAnim.customAtRules,
			},
			visitor: timedAnim.visitor(pluginConfig),
		});

		expect(res.code.toString()).toBe(
			":root{--duration-anim-name:8.25s}@keyframes anim-name{0%{background-color:red}12.1212%{background-color:red}42.4242%{background-color:#0ff}42.4243%{background-color:purple}54.5455%{background-color:purple}63.6364%{background-color:pink}to{background-color:pink}}",
		);
	});

	test("steps and waits (no duration var)", () => {
		const res = transform({
			filename: "test.css",
			minify: true,
			code: Buffer.from(`
      @anim anim-name {
        @step 0.5s, 1s {
          background-color: red;
        }
        @step 2.5s  {
          background-color: cyan;
        }
        @step 0s, 1s  {
          background-color: purple;
        }
        @step 0.75s, 3s  {
          background-color: pink;
        }
      }
      `),
			customAtRules: {
				...timedAnim.customAtRules,
			},
			visitor: timedAnim.visitor({ ...pluginConfig, durationVar: false }),
		});

		expect(res.code.toString()).toBe(
			"@keyframes anim-name{5.71429%{background-color:red}17.1429%{background-color:red}45.7143%{background-color:#0ff}45.7144%{background-color:purple}57.1429%{background-color:purple}65.7143%{background-color:pink}to{background-color:pink}}",
		);
	});
});

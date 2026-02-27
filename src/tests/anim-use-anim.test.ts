import { transform } from "lightningcss";
import { describe, expect, test } from "vitest";
import timedAnim from "$src";
import type { IConfig } from "$utils/config";

describe("anim: @use-anim", () => {
	const pluginConfig: IConfig = { vendorPrefix: "none" };

	test("multiple steps (no wait)", () => {
		const res = transform({
			filename: "test.css",
			minify: true,
			code: Buffer.from(`
      @anim anim-1 {
        @step 1s, 0.5s {
          background-color: red;
        }
        @step 0.5s, 3s {
          background-color: blue;
        }
        @step 1.5s {
          background-color: cyan;
        }
      }

      @anim anim-2 {
        @use-anim anim-1;
        @use-anim anim-1;
      }
      `),
			customAtRules: {
				...timedAnim.customAtRules,
			},
			visitor: timedAnim.visitor(pluginConfig),
		});

		expect(res.code.toString()).toBe(
			":root{--duration-anim-1:6.5s}@keyframes anim-1{15.3846%{background-color:red}23.0769%{background-color:red}30.7692%{background-color:#00f}76.9231%{background-color:#00f}to{background-color:#0ff}}:root{--duration-anim-2:13s}@keyframes anim-2{7.69231%{background-color:red}11.5385%{background-color:red}15.3846%{background-color:#00f}38.4615%{background-color:#00f}50%{background-color:#0ff}57.6923%{background-color:red}61.5385%{background-color:red}65.3846%{background-color:#00f}88.4615%{background-color:#00f}to{background-color:#0ff}}",
		);
	});
});

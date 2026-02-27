import { describe, expect, test } from "vitest";
import { DEAFULT_CONFIG, parseConfig } from "$utils/config";

describe("config: parseConfig", () => {
	test("no config: should output DEFAULT", () => {
		const config = parseConfig();
		expect(config).toStrictEqual(DEAFULT_CONFIG);
	});

	test("empty object: should output DEFAULT", () => {
		const config = parseConfig({});
		expect(config).toStrictEqual(DEAFULT_CONFIG);
	});

	test("unknown properties: should be stripped", () => {
		// biome-ignore lint: testing stripping of unknown properties on config
		const config = parseConfig({ test_1: 1, test_2: () => "yes" } as any);
		expect(config).toStrictEqual(DEAFULT_CONFIG);
	});

	test('vendorPrefix "all": should output all vendor prefixes', () => {
		const config = parseConfig({ vendorPrefix: "all" });
		expect(config).toHaveProperty("vendorPrefix");
		expect(config.vendorPrefix).toStrictEqual(DEAFULT_CONFIG.vendorPrefix);
	});

	test('vendorPrefix "none" | null: should output ["none"]', () => {
		let config = parseConfig({ vendorPrefix: "none" });
		expect(config).toHaveProperty("vendorPrefix");
		expect(config.vendorPrefix).toStrictEqual(["none"]);

		config = parseConfig({ vendorPrefix: null });
		expect(config).toHaveProperty("vendorPrefix");
		expect(config.vendorPrefix).toStrictEqual(["none"]);
	});

	test("vendorPrefix custom prefixes: should output all provided prefixes", () => {
		const config = parseConfig({ vendorPrefix: ["moz", "ms"] });
		expect(config).toHaveProperty("vendorPrefix");
		expect(config.vendorPrefix).toStrictEqual(["moz", "ms"]);
	});

	test("durationVar false: should output null", () => {
		const config = parseConfig({
			durationVar: false,
		});
		expect(config).toHaveProperty("durationVar");
		expect(config.durationVar).toBeNull();
	});

	test("durationVar custom name: should output custom name", () => {
		const config = parseConfig({
			durationVar: (n) => `test_${n}_test`,
		});
		expect(config).toHaveProperty("durationVar");
		expect(config.durationVar).toBeTypeOf("function");
		expect(config.durationVar?.("middle")).toBe("test_middle_test");
	});
});

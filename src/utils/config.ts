import type { VendorPrefix } from "lightningcss";

export interface IParsedConfig {
	durationVar: null | ((name: string) => string);
	vendorPrefix: VendorPrefix;
}

export interface IConfig {
	durationVar?: false | ((name: string) => string);
	vendorPrefix?: "all" | "none" | null | VendorPrefix;
}

export const DEAFULT_CONFIG: IParsedConfig = {
	durationVar: (name: string) => `duration-${name}`,
	vendorPrefix: ["webkit", "moz", "ms", "o"],
};

export const parseConfig = (config?: IConfig): IParsedConfig => {
	let vendorPrefix: VendorPrefix = DEAFULT_CONFIG.vendorPrefix;
	if (typeof config?.vendorPrefix !== "undefined") {
		if (Array.isArray(config.vendorPrefix)) {
			vendorPrefix = config.vendorPrefix;
		} else if (config.vendorPrefix === "none" || config.vendorPrefix === null) {
			vendorPrefix = ["none"];
		}
	}

	let durationVar: IParsedConfig["durationVar"] = DEAFULT_CONFIG.durationVar;
	if (typeof config?.durationVar !== "undefined") {
		if (config.durationVar === false) durationVar = null;
		else durationVar = config.durationVar;
	}

	return {
		durationVar,
		vendorPrefix,
	};
};

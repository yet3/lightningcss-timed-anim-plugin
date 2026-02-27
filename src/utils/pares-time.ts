import type { ParsedComponent, TokenOrValue } from "lightningcss";

export const parseeTime = (comp?: ParsedComponent | TokenOrValue): number => {
	if (comp?.type === "time") {
		if (comp.value.type === "milliseconds") {
			return comp.value.value;
		}
		return comp.value.value * 1000;
	}
	return 0;
};

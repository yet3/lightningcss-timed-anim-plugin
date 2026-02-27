import type { TokenOrValue, UnknownAtRule } from "lightningcss";
import { allAnims } from "$src/state";
import type { IAtAnimSubHandler } from "$src/types";

export const handleAtUseAnim: IAtAnimSubHandler = (rule) => {
	if (rule.type !== "unknown") return false;

	const data = rule.value as UnknownAtRule;
	if (data.name !== "use-anim") return false;

	const prelude = data.prelude as TokenOrValue[];
	const identToken = prelude[0];

	if (identToken?.type !== "token" || identToken.value.type !== "ident") {
		return false;
	}

	const anim = allAnims.get(identToken.value.value);
	if (!anim) return false;

	return {
		totalTime: anim.totalTime,
		steps: anim.steps,
	};
};

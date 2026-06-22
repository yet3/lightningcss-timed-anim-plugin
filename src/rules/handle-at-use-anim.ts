import { allAnims } from "$src/state";
import type { IAtAnimSubHandler, ICustomRule } from "$src/types";

export const handleAtUseAnim: IAtAnimSubHandler = (rule) => {
	if (rule.type !== "custom") return false;

	const data = rule.value as unknown as ICustomRule;
	if (data.name !== "use-anim") return false;
	if (data.prelude.type !== "token-list") return false;

	const prelude = data.prelude.value;
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

import type { TokenOrValue, UnknownAtRule } from "lightningcss";
import { definedSteps } from "$src/state";
import type { IAtAnimSubHandler } from "$src/types";
import { parseeTime } from "$utils/pares-time";

export const handleAtUseStep: IAtAnimSubHandler = (rule) => {
	if (rule.type !== "unknown") return false;

	const data = rule.value as UnknownAtRule;
	if (data.name !== "use-step") return false;

	const prelude = data.prelude as TokenOrValue[];
	const identToken = prelude[0];

	if (identToken?.type !== "token" || identToken.value.type !== "ident") {
		return false;
	}

	const step = definedSteps.get(
		`${data.loc.source_index}-${identToken.value.value}`,
	);
	if (!step) return false;

	const times = prelude.filter((el) => el.type === "time");
	const duration = parseeTime(times[0]);
	const wait = parseeTime(times[1]);

	return {
		totalTime: duration + wait,
		steps: [
			{
				duration,
				wait,
				body: step,
			},
		],
	};
};

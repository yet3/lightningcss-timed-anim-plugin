import { definedSteps } from "$src/state";
import type { IAtAnimSubHandler, ICustomRule } from "$src/types";
import { parseTime } from "$utils/parse-time";

export const handleAtUseStep: IAtAnimSubHandler = (rule) => {
	if (rule.type !== "custom") return false;

	const data = rule.value as unknown as ICustomRule;
	if (data.name !== "use-step") return false;
	if (data.prelude.type !== "token-list") return false;

	const prelude = data.prelude.value;
	const identToken = prelude[0];

	if (identToken?.type !== "token" || identToken.value.type !== "ident") {
		return false;
	}

	const step =
		definedSteps.get(`${data.loc.source_index}-${identToken.value.value}`) ??
		definedSteps.get(identToken.value.value);
	if (!step) return false;

	const times = prelude.filter((el) => el.type === "time");
	const duration = parseTime(times[0]);
	const wait = parseTime(times[1]);

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

import type { IAtAnimSubHandler, IStepRule } from "$src/types";
import { parseTime } from "$utils/parse-time";

export const handleAtStep: IAtAnimSubHandler = (rule) => {
	if (rule.type !== "custom") return false;

	const data = rule.value as unknown as IStepRule;
	if (data.name !== "step" || data.prelude.type !== "repeated") {
		return false;
	}

	const duration = parseTime(data.prelude.value.components[0]);
	const wait = parseTime(data.prelude.value.components[1]);

	return {
		totalTime: duration + wait,
		steps: [
			{
				duration,
				wait,
				body: data.body.value,
			},
		],
	};
};

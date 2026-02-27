import type {
	CustomAtRules,
	Declaration,
	Keyframe,
	Visitor,
} from "lightningcss";
import { handleAtStep } from "$rules/handle-at-step";
import { handleAtUseAnim } from "$rules/handle-at-use-anim";
import { handleAtUseStep } from "$rules/handle-at-use-step";
import { allAnims, definedSteps } from "$src/state";
import type { IAtAnimSubHandler, IStep } from "$src/types";
import { type IConfig, parseConfig } from "$utils/config";
import { makeKeyframesRule } from "$utils/make-keyframes-rule";
import { stepToKeyframe } from "$utils/step-to-keyframe";

const customAtRules = {
	anim: {
		prelude: "<custom-ident>",
		body: "rule-list",
	},
	"anim-step": {
		prelude: "<custom-ident>",
		body: "style-block",
	},
	step: {
		prelude: "<time>#",
		body: "style-block",
	},
} satisfies CustomAtRules;

const visitor = (_config?: IConfig): Visitor<typeof customAtRules> => {
	const config = parseConfig(_config);

	return {
		Rule: {
			custom: {
				"anim-step"(rule) {
					definedSteps.set(
						`${rule.loc.source_index}-${rule.prelude.value}`,
						rule.body.value,
					);
					return [];
				},
				anim(rule) {
					const steps: IStep[] = [];
					let totalTime = 0;

					const handlers: IAtAnimSubHandler[] = [
						handleAtStep,
						handleAtUseStep,
						handleAtUseAnim,
					];

					for (const r of rule.body.value) {
						for (const handler of handlers) {
							const result = handler(r);
							if (result) {
								totalTime += result.totalTime;
								steps.push(...result.steps);
							}
						}
					}

					allAnims.set(rule.prelude.value, {
						totalTime,
						steps,
					});

					const frames: Keyframe<Declaration>[] = [];
					let accumulatedDur = 0;
					for (const [idx, step] of steps.entries()) {
						const result = stepToKeyframe({
							idx,
							step,
							totalTime,
							accumulatedDur,
						});
						accumulatedDur = result.accumulatedDur;
						frames.push(...result.frames);
					}

					return makeKeyframesRule({
						name: rule.prelude.value,
						durationName: config.durationVar
							? config.durationVar(rule.prelude.value)
							: null,
						loc: rule.loc,
						totalTime,
						vendorPrefix: config.vendorPrefix,
						frames,
					});
				},
			},
		},
	};
};

export default {
	customAtRules,
	visitor,
};

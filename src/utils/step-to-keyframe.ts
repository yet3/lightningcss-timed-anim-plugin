import type { Declaration, DeclarationBlock } from "lightningcss";
import type { IKeyframe, IStep } from "$src/types";

interface IProps {
	step: IStep;
	totalTime: number;
	accumulatedDur: number;
	idx: number;
}

interface IResult {
	accumulatedDur: number;
	frames: IKeyframe[];
}

export const stepToKeyframe = ({
	step,
	totalTime,
	accumulatedDur: _accDur,
	idx,
}: IProps): IResult => {
	const frames: IKeyframe[] = [];
	let accumulatedDur = _accDur;

	const declarations = step.body
		.filter((el) => el.type === "nested-declarations")
		.map((el) => el.value.declarations);

	if (declarations[0]) {
		const addFrame = (dur: number) => {
			frames.push({
				selectors: [
					{
						type: "percentage",
						value: dur,
					},
				],
				declarations: declarations[0] as DeclarationBlock<Declaration>,
			});
		};

		if (step.duration === 0 && idx > 0) {
			addFrame(accumulatedDur / totalTime + 0.000001);
		} else {
			accumulatedDur += step.duration;
			addFrame(accumulatedDur / totalTime);
		}

		if (step.wait) {
			accumulatedDur += step.wait;
			addFrame(accumulatedDur / totalTime);
		}
	}

	return {
		accumulatedDur,
		frames,
	};
};

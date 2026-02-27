import type {
	Keyframe,
	Location2,
	ReturnedDeclaration,
	ReturnedRule,
	VendorPrefix,
} from "lightningcss";

interface IProps {
	name: string;
	loc: Location2;
	totalTime: number;
	frames: Keyframe<ReturnedDeclaration>[];
	vendorPrefix: VendorPrefix;
	durationName: string | null;
}

export const makeKeyframesRule = ({
	name,
	loc,
	totalTime,
	vendorPrefix,
	frames,
	durationName = null,
}: IProps): ReturnedRule[] => {
	const result: ReturnedRule[] = [];

	if (durationName) {
		result.push({
			type: "style",
			value: {
				loc: loc,
				declarations: {
					declarations: [
						{
							property: "custom",
							value: {
								name: `--${durationName}`,
								value: [
									{
										type: "time",
										value: {
											type: "milliseconds",
											value: totalTime,
										},
									},
								],
							},
						},
					],
				},
				selectors: [
					[
						{
							type: "pseudo-class",
							kind: "root",
						},
					],
				],
			},
		});
	}

	result.push({
		type: "keyframes",
		value: {
			loc: loc,
			name: {
				type: "custom",
				value: name,
			},
			vendorPrefix,
			keyframes: frames,
		},
	});

	return result;
};

import type {
	Declaration,
	Keyframe,
	Location2,
	ParsedComponent,
	Rule,
} from "lightningcss";

type IFindType<T> = T extends { type: "repeated" } ? T : never;

export interface IAnim {
	steps: IStep[];
	totalTime: number;
}

export interface IStep {
	duration: number;
	wait: number;
	body: Rule[];
}

export type IKeyframe = Keyframe<Declaration>;

export interface IStepRule {
	name: string;
	prelude: IFindType<ParsedComponent>;
	loc: Location2;
	body: {
		type: "rule-list";
		value: Rule[];
	};
}

export type IAtAnimSubHandler = (
	rule: Rule,
) => false | { totalTime: number; steps: IStep[] };

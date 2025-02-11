export enum RuleTypes {
	FULL_URI = 'FULL_URI',
	URI = 'URI', //path + query string
	URI_PATH = 'URI_PATH',
	URI_QUERY_STRING = 'URI_QUERY_STRING',
	REQUEST_METHOD = 'REQUEST_METHOD',
	// COOKIE = 'COOKIE',
	// HEADER = 'HEADER',
	// USER_AGENT = 'USER_AGENT',
}

export enum RuleOperators {
	WILDCARD = 'WILDCARD',
	EQUALS = 'EQUALS',
	NOT_EQUALS = 'NOT_EQUALS',
	GREATER_THAN = 'GREATER_THAN',
	LESS_THAN = 'LESS_THAN',
	GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
	LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
	CONTAINS = 'CONTAINS',
	IS_IN = 'IS_IN',
	IS_NOT_IN = 'IS_NOT_IN',
	STARTS_WITH = 'STARTS_WITH',
	ENDS_WITH = 'ENDS_WITH',
	DOES_NOT_START_WITH = 'DOES_NOT_START_WITH',
	DOES_NOT_END_WITH = 'DOES_NOT_END_WITH',
	EXISTS = 'EXISTS',
	DOES_NOT_EXIST = 'DOES_NOT_EXIST',
}
export type RuleValue = {
	key?: string;
	value: string | boolean | number | undefined;
};

export type Logic = "and" | "or" | null;

export interface Rule {
	id: number;
	type: RuleTypes;
	operator: RuleOperators;
	value: RuleValue;
	logic: Logic
}

interface RuleBuildErrorData {
	type?: string;
	value?: RuleValue;
	operator?: string;
	logic?: Logic;
}
export class RuleBuildError extends Error {
	data: RuleBuildErrorData;

	constructor(message: string, data: RuleBuildErrorData) {
		super(message);
		this.name = 'RuleBuildError';
		this.message = message;
		this.data = { value: data.value, type: data.type, operator: data.operator, logic: data.logic };
	}
}

export function buildRule(id: number, type: RuleTypes, operator: RuleOperators, value: RuleValue, logic: Logic): Rule {
	const r = { value, operator, type };

	if (!(type in RuleTypes)) {
		throw new RuleBuildError('Unsupported Rule Type!', r);
	}

	if (!(operator in RuleOperators)) {
		throw new RuleBuildError('Unsupported Rule Operator!', r);
	}

	if (!value) {
		throw new RuleBuildError('Invalid Rule Value!', r);
	}

	if (logic && (logic !== 'and' && logic !== 'or')) {
		throw new RuleBuildError('Invalid Rule Logic!', r);
	}

	if (!ruleConstraints[type as keyof typeof ruleConstraints]?.includes(operator)) {
		throw new RuleBuildError('Unsupported rule operator!', r);
	}

	const rule: Rule = { id, type, operator, value, logic };

	return rule;
}

export type HeaderValue = {
	[key: string]: string;
};

export interface RuleConstraints {
	[RuleTypes.FULL_URI]: RuleOperators[];
	[RuleTypes.URI]: RuleOperators[];
	[RuleTypes.URI_PATH]: RuleOperators[];
	[RuleTypes.URI_QUERY_STRING]: RuleOperators[];
	[RuleTypes.REQUEST_METHOD]: RuleOperators[];
	// [RuleTypes.HEADER]: RuleOperators[];
	// [RuleTypes.COOKIE]: RuleOperators[];
	// [RuleTypes.USER_AGENT]: RuleOperators[];
}

export const ruleConstraints: RuleConstraints = {
	[RuleTypes.FULL_URI]: [
		RuleOperators.EQUALS,
		RuleOperators.NOT_EQUALS,
		RuleOperators.CONTAINS,
		RuleOperators.STARTS_WITH,
		RuleOperators.ENDS_WITH,
		RuleOperators.DOES_NOT_START_WITH,
		RuleOperators.DOES_NOT_END_WITH,
		RuleOperators.WILDCARD,
	],
	[RuleTypes.URI]: [
		RuleOperators.EQUALS,
		RuleOperators.NOT_EQUALS,
		RuleOperators.CONTAINS,
		RuleOperators.STARTS_WITH,
		RuleOperators.ENDS_WITH,
		RuleOperators.DOES_NOT_START_WITH,
		RuleOperators.DOES_NOT_END_WITH,
		RuleOperators.WILDCARD,
	],
	[RuleTypes.URI_PATH]: [
		RuleOperators.EQUALS,
		RuleOperators.NOT_EQUALS,
		RuleOperators.CONTAINS,
		RuleOperators.STARTS_WITH,
		RuleOperators.ENDS_WITH,
		RuleOperators.DOES_NOT_START_WITH,
		RuleOperators.DOES_NOT_END_WITH,
		RuleOperators.WILDCARD,
	],
	[RuleTypes.URI_QUERY_STRING]: [
		RuleOperators.EQUALS,
		RuleOperators.NOT_EQUALS,
		RuleOperators.CONTAINS,
		RuleOperators.STARTS_WITH,
		RuleOperators.ENDS_WITH,
		RuleOperators.DOES_NOT_START_WITH,
		RuleOperators.DOES_NOT_END_WITH,
		RuleOperators.WILDCARD,
	],
	[RuleTypes.REQUEST_METHOD]: [RuleOperators.EQUALS, RuleOperators.NOT_EQUALS],

	// [RuleTypes.HEADER]: [
	// 	RuleOperators.EQUALS,
	// 	RuleOperators.NOT_EQUALS,
	// 	RuleOperators.CONTAINS,
	// 	RuleOperators.STARTS_WITH,
	// 	RuleOperators.ENDS_WITH,
	// 	RuleOperators.DOES_NOT_START_WITH,
	// 	RuleOperators.DOES_NOT_END_WITH,
	// 	RuleOperators.EXISTS,
	// 	RuleOperators.DOES_NOT_EXIST,
	// ],
	/*[RuleTypes.COOKIE]: [
		RuleOperators.EQUALS,
		RuleOperators.NOT_EQUALS,
		RuleOperators.CONTAINS,
		RuleOperators.STARTS_WITH,
		RuleOperators.ENDS_WITH,
		RuleOperators.DOES_NOT_START_WITH,
		RuleOperators.DOES_NOT_END_WITH,
		RuleOperators.EXISTS,
		RuleOperators.DOES_NOT_EXIST,
	],
	[RuleTypes.USER_AGENT]: [
		RuleOperators.EQUALS,
		RuleOperators.NOT_EQUALS,
		RuleOperators.CONTAINS,
		RuleOperators.STARTS_WITH,
		RuleOperators.ENDS_WITH,
		RuleOperators.DOES_NOT_START_WITH,
		RuleOperators.DOES_NOT_END_WITH,
		RuleOperators.EXISTS,
		RuleOperators.DOES_NOT_EXIST,
	],*/
};

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { ChangeEvent, useState } from 'react';

type Logic = 'and' | 'or' | null;

type Expression = {
	id: number;
	logic: Logic;
	type: string;
	operator: string;
	value: string;
}


interface RuleExpressionProps {
	onDelete: () => void;
	showDelete: boolean;
	logic: Logic;
	onAddExpression: (logic: Logic) => void;
	onUpdateExpression: (key: number, rule:string, operator:string, value:string) => void;
	isLast: boolean;
	constraints: Constraints;
	id: number;
	expresssion: Expression;
}

type Constraints = {
	[key: string]: string[]
}

export default function RuleExpression({ onDelete, showDelete, logic, onAddExpression, onUpdateExpression, isLast, constraints, id, expresssion}: RuleExpressionProps) {
	const [selectedType, setSelectedType] = useState<string>(expresssion.type);
	const [selectedOperator, setSelectedOperator] = useState<string>(expresssion.operator);
	const [value, setValue] = useState<string>(expresssion.value);

	const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
		onUpdateExpression(id, selectedType, selectedOperator, e.target.value);
	};

	const handleOperator = (v: string) => {
		setSelectedOperator(v);
		onUpdateExpression(id, selectedType, v, value);
	};

	const handleRule = (v: string) => {
		setSelectedType(v);
		setSelectedOperator(''); 
		onUpdateExpression(id, v, selectedOperator, value);
	};

		return (
		<div className="space-y-2">
			{logic && (
				<Select defaultValue={logic} disabled>
					<SelectTrigger className="w-[100px]">
						<SelectValue>{logic.toUpperCase()}</SelectValue>
					</SelectTrigger>
				</Select>
			)}
			<div className="flex flex-wrap items-center gap-2">
				<Select value={selectedType} onValueChange={handleRule}>
					<SelectTrigger className="w-[200px]">
						<SelectValue placeholder="Select field" />
					</SelectTrigger>
					<SelectContent>
						{Object.keys(constraints)?.map((rule) => (
							<SelectItem key={rule} value={rule}>{rule}</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={selectedOperator} onValueChange={handleOperator}>
					<SelectTrigger className="w-[220px]">
						<SelectValue placeholder="Select operator" />
					</SelectTrigger>
					<SelectContent>
						{constraints[selectedType as keyof typeof constraints]?.map((op, i) => (
							<SelectItem key={i} value={op}>{op}</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Input className="flex-grow" placeholder="Enter value" value={value} onChange={handleValue} />
				{showDelete && (
					<Button type="button" variant="ghost" size="icon" onClick={onDelete}>
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>
			{isLast && (
				<div className="flex gap-2 mt-2">
					<Button type="button" variant="outline" onClick={() => onAddExpression('and')}>
						AND
					</Button>
					<Button type="button" variant="outline" onClick={() => onAddExpression('or')}>
						OR
					</Button>
				</div>
			)}
		</div>
	);
}

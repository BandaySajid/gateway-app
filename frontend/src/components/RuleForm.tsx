import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RuleExpression from './RuleExpression';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { API_HOST } from '../../config.mjs';
import Back from './Back';
import AuthFetch from '@/utils/AuthFetch';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from './ui/badge';

type Logic = 'and' | 'or' | null;

type Constraints = {
	[key: string]: string[];
};

type Expression = {
	id: number;
	logic: Logic;
	type: string;
	operator: string;
	value: string;
};

type Data = {
	name: string;
	host: string;
	protocol: string;
	period: number;
	duration: number;
	frequency: number;
	port: string | undefined;
	filter: 'custom' | 'all';
	expressions: Expression[];
};

export default function RatelimitForm() {
	const navigate = useNavigate();
	const { toast } = useToast();

	const [filterType, setFilterType] = useState('all');
	const [expressions, setExpressions] = useState<Expression[]>([]);
	const [constraints, setConstraints] = useState<Constraints>({});
	const [ruleName, setRuleName] = useState('');
	const [host, setHost] = useState('');
	const [protocol, setProtocol] = useState('https');
	const [period, setPeriod] = useState(10);
	const [duration, setDuration] = useState(period);
	const [frequency, setFrequency] = useState(10);
	const [port, setPort] = useState('');
	const [hostId, setHostId] = useState(window.location.pathname.split('/').pop())

	useEffect(() => {
		setHostId(window.location.pathname.split('/').pop())
	}, []);

	useEffect(() => {
		if(expressions.length <=0){
			setExpressions([{ id: Date.now(), logic: null, value: '', operator: '', type: '' }])
		}
	}, [filterType]);

	function handlePeriod(p: number) {
		setPeriod(p);
		setDuration(p);
	}

	const fetchRuleData = async () => {
		if (hostId && hostId !== 'new') {
			try {
				const url = API_HOST + `/rules/${hostId}`;
				const response = await AuthFetch(url);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setRuleName(data.result.name);
				setHost(data.result.host);
				setProtocol(data.result.protocol);
				setPeriod(data.result.period);
				setDuration(data.result.duration);
				setFrequency(data.result.frequency);
				setFilterType(data.result.filter);
				setPort(data.result.port || '');
				if (data.result.expressions) {
					const r = JSON.parse(data.result.expressions);
					if (r.length > 0) {
						setExpressions(r);
					}
				}
			} catch (error) {
				console.error('Error fetching host data:', error);
			}
		} else{
			setRuleName('');
			setHost('');
			setProtocol('https');
			setPeriod(10);
			setDuration(10);
			setFrequency(1);
			setFilterType('all');
			setPort('');
			setExpressions([{ id: Date.now(), logic: null, value: '', operator: '', type: '' }]);
		}
	};

	useEffect(() => {
		fetchRuleData();
	}, [hostId]);

	useEffect(() => {
		fetchConstraints();
	}, []);

	const addExpression = (logic: Logic) => {
		setExpressions([...expressions, { id: Date.now(), logic, type: '', operator: '', value: '' }]);
	};

	const removeExpression = (id: number) => {
		const f = expressions.filter((exp) => exp.id !== id);
		if (expressions[0].id === id) {
			f[0].logic = null;
		}
		setExpressions(f);
	};

	const updateExpression = (key: number, type: string, operator: string, value: string) => {
		setExpressions((prevExpressions) => prevExpressions.map((exp) => (exp.id === key ? { ...exp, type, operator, value } : exp)));
	};

	const fetchConstraints = async () => {
		try {
			const response = await fetch(API_HOST + '/constraints');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			setConstraints(data.constraints);
		} catch (error) {
			console.error('Error fetching rules:', error);
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		// Prepare data for submission
		const data = {
			name: ruleName,
			host,
			protocol,
			period,
			duration,
			frequency,
			filter: filterType,
		} as Data;

		if (port) {
			data.port = port;
		}

		if (filterType === 'custom') {
			data.expressions = expressions;
		}

		try {
			const url = API_HOST + `/rules${hostId !== 'new' ? `/${hostId}` : ''}`;
			const response = await AuthFetch(url, {
				method: hostId === 'new' ? 'POST' : 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error);
			}

			toast({
				description: 'Host saved',
			});

			navigate('/rules', { replace: true });
		} catch (error) {
			let msg = '';
			if (error instanceof Error) msg = error.message;
			toast({
				title: 'Error!',
				description: msg,
				variant: 'destructive',
			});
			console.error('Error creating host:', error);
		}
	};

	return (
		<Card className="w-full md:mx-auto lg:max-w-7xl p-2 rounded-sm shadow-lg flex flex-col border-neutral-800 bg-neutral-950 text-neutral-50">
			<CardHeader>
				<CardTitle>
					<Back />
					<h1 className="text-3xl font-bold text-center text-white">Rule</h1>
				</CardTitle>
			</CardHeader>
			< CardContent className="space-y-4 text-gray-300" >
				<div className="space-y-2">
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						type="text"
						value={ruleName}
						onChange={(e) => setRuleName(e.target.value)}
						placeholder="Enter rule name"
						required
						className='border-neutral-800 file:text-neutral-50 placeholder:text-neutral-400 focus-visible:ring-neutral-300'
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="host">Host</Label>
					<Input
						id="host"
						type="text"
						value={host}
						onChange={(e) => setHost(e.target.value)}
						placeholder="Enter host or ip address (e.g) google.com or amplizard.com 187.22.1.2" 
						required
						className='border-neutral-800 file:text-neutral-50 placeholder:text-neutral-400 focus-visible:ring-neutral-300'
					/>
				</div>


				<div>
					<Label>Rule Expression</Label >
					<RadioGroup value={filterType} defaultValue={''} onValueChange={setFilterType} className="mt-2 space-y-1">
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="all" id="allRequests" className="cursor-pointer border-neutral-800 border-neutral-50 text-neutral-50 focus-visible:ring-neutral-300" />
							<Label htmlFor="allRequests" className="cursor-pointer">
								All Requests
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="custom" id="customFilter" className="cursor-pointer border-neutral-800 border-neutral-50 text-neutral-50 focus-visible:ring-neutral-300" />
							<Label htmlFor="customFilter" className="cursor-pointer">
								Custom Filter Expression
							</Label>
						</div>
					</RadioGroup>
				</div>

				{filterType === 'custom' && (
					<div className="space-y-2">
						{expressions.map((exp, index) => (
							<RuleExpression
								key={exp.id}
								id={exp.id}
								onDelete={() => removeExpression(exp.id)}
								showDelete={expressions.length > 1}
								logic={exp.logic}
								onAddExpression={addExpression}
								onUpdateExpression={updateExpression}
								isLast={index === expressions.length - 1}
								constraints={constraints}
								expresssion={exp}
							/>
						))}
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="protocol">Protocol</Label>
						<Select value={protocol} onValueChange={setProtocol} required>
							<SelectTrigger id="protocol" className='border-neutral-800 ring-offset-neutral-950 placeholder:text-neutral-400 focus:ring-neutral-300'>
								<SelectValue placeholder="Select protocol" />
							</SelectTrigger>
							<SelectContent className='border-neutral-800 bg-neutral-950 text-neutral-50'>
								<SelectItem value="http" className="cursor-pointer focus:bg-neutral-800 focus:text-neutral-50">
									HTTP
								</SelectItem>
								<SelectItem value="https" className="cursor-pointer focus:bg-neutral-800 focus:text-neutral-50">
									HTTPS
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="period">Period (seconds)</Label>
						<Input
							id="period"
							type="number"
							value={period}
							onChange={(e) => handlePeriod(parseInt(e.target.value, 10))}
							placeholder="Enter period"
							min={1}
							required
							className='border-neutral-800 file:text-neutral-50 placeholder:text-neutral-400 focus-visible:ring-neutral-300'
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="duration">
							Duration (seconds) <Badge variant={'secondary'} className='p-1 bg-neutral-800 text-neutral-50 hover:bg-neutral-800/80'>coming soon</Badge> 
						</Label>
						<Input
							disabled
							id="duration"
							type="number"
							value={duration}
							// onChange={(e) => setDuration(parseInt(e.target.value, 10))}
							placeholder="Enter duration"
							min={1}
							required
							className='border-neutral-800 file:text-neutral-50 placeholder:text-neutral-400 focus-visible:ring-neutral-300'
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="requestDuration">Request Frequency (number of requests)</Label>
						<Input
							id="requestDuration"
							type="number"
							value={frequency}
							min={1}
							onChange={(e) => setFrequency(parseInt(e.target.value, 10))}
							placeholder="Enter request frequency"
							required
							className='border-neutral-800 file:text-neutral-50 placeholder:text-neutral-400 focus-visible:ring-neutral-300'
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="port">Port (Optional)</Label>
						<Input id="port" type="number" value={port} min={0} max={65535} onChange={(e) => setPort(e.target.value)} placeholder="Enter port" className='border-neutral-800 file:text-neutral-50 placeholder:text-neutral-400 focus-visible:ring-neutral-300' />
					</div>
				</div>

				<Button variant={'default'} className="bg-neutral-50 text-neutral-900 hover:bg-neutral-50/90 cursor-pointer w-full" type="submit" onClick={handleSubmit}>
					Save
				</Button>
			</CardContent>
		</Card>

	);
}

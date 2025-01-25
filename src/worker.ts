import { IRequest, Router, cors, json } from 'itty-router';
import { buildRule, Rule, RuleBuildError } from './rules';

interface HostData {
	host: string;
	period: number;
	duration: number;
	frequency: number;
	port?: string;
	protocol: 'http' | 'https';
	rules: Rule[];
}

const allowedOrigins = '*';

function generateRandomId() {
	const array = new Uint8Array(16);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function isHostData(arg: any): arg is HostData {
	return (
		(arg &&
			typeof arg.host === 'string' &&
			typeof arg.period === 'number' &&
			typeof arg.duration === 'number' &&
			typeof arg.frequency === 'number' &&
			(arg.protocol === 'https' || arg.protocol === 'http') &&
			(arg.port === 'string' || arg.port === undefined) &&
			Array.isArray(arg.rules)) ||
		arg.rules === undefined
	);
}

const { preflight, corsify } = cors({ origin: allowedOrigins });

const router = Router();

router.options('*', preflight);

router.use(json());

router.post('/hosts', async (req: IRequest, env: Env, ctx: ExecutionContext) => {
	const body = await req.json();

	if (!isHostData(body)) {
		return new Response('Bad Request', { status: 400 });
	}

	try {
		let id = 0;
		let rules = [] as Rule[];

		for (const rule of body.rules) {
			id++;
			const r = buildRule(id, rule.type, rule.operator, rule.value);
			rules.push(r);
		}

		const host_id = generateRandomId();

		await env.DB.prepare(
			`INSERT INTO hosts (id, host, protocol, port, period, duration, frequency, rules)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
		)
			.bind(
				host_id,
				body.host,
				body.protocol,
				body.port || null,
				body.period * 1000,
				body.duration * 1000,
				body.frequency,
				rules ? JSON.stringify(rules) : null,
			)
			.run();

		return json({ success: true, id: host_id }, { status: 201 });
	} catch (err) {
		if (err instanceof RuleBuildError) {
			console.error('Rule Build Error:', err);
			return json({ success: false, error: err.message, data: err.data }, { status: 400 });
		}
		if (err instanceof Error) {
			console.error('internal error:', err);
			return json({ success: false, error: 'internal error' }, { status: 500 });
		}
	}
});

router.get('/hosts/:id', async (req: IRequest, env: Env, ctx: ExecutionContext) => {
	try {
		let id = req.params.id;

		const { results } = await env.DB.prepare(`SELECT * FROM hosts WHERE id = ?`).bind(id).all();

		return json({ success: true, result: results.length > 0 ? results[0] : null }, { status: 200 });
	} catch (err) {
		if (err instanceof Error) {
			console.error('internal error:', err);
			return json({ success: false, error: 'internal error' }, { status: 500 });
		}
	}
});

router.all('*', async (req, env, ctx) => {
	return new Response('resource not found', { status: 404 });
});

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return router
			.fetch(request, env, ctx)
			.then(json)
			.catch((error: Error) => {
				console.error('Error during fetch', error);
				return new Response('Internal Server Error', { status: 500 });
			})
			.then((r: Response) => corsify(r, request));
	},
} satisfies ExportedHandler<Env>;

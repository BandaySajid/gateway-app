import { IRequest, RequestHandler, Router, json } from 'itty-router';
import { buildRule, Rule, RuleBuildError, ruleConstraints } from './rules';
import { decodeProtectedHeader, importJWK, jwtVerify } from 'jose';
import { JWTExpired } from 'jose/errors';
import { validateHostData } from './validator';

enum Plan {
	free = 'free',
	// basic = 'basic',
	premium = 'premium'
}

interface HostData {
	name: string;
	host: string;
	period: number;
	duration: number;
	frequency: number;
	port?: string;
	protocol: 'http' | 'https';
	filter: 'all' | 'custom';
	expressions: Rule[];
}

interface AuthRequestData {
	token: string
}

interface UserData {
	id: string;
	name: string;
	email: string;
	plan?: Plan;
}

function isAuthRequestData(arg: any): arg is AuthRequestData {
	return (
		arg &&
		typeof arg.token === 'string'
	);
}

interface GooglePublicKey {
	kid: string;
	e: string;
	alg: string;
	n: string;
	kty: string;
	use: string;
}

interface GooglePublicKeysReponse {
	keys: GooglePublicKey[]
}


const CORS_HEADERS = {
	'Access-Control-Allow-Origin': "*",
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	'Access-Control-Allow-Credentials': 'true',
}

const TWENTY_FOUR_HOURS = 60 * 60 * 24;

const ID_LENGTH = 32;

function generateRandomId() {
	const array = new Uint8Array(ID_LENGTH / 2);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

interface AuthRequest extends IRequest {
	user: UserData;
}

const withAuthenticatedUser: RequestHandler = async (req: IRequest, env: Env) => {
	const authHeader = req.headers.get('Authorization');
	const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
	const ru = env.FRONTEND_HOST + "/auth";
	if (!token) {
		const response = new Response(null, {
			status: 302,
			headers: {
				'Location': ru,
				...CORS_HEADERS
			}
		});
		return response;
	}

	try {
		const user = await verifyGoogleAuthToken(token, env);

		if (!user) {
			const response = new Response(null, {
				status: 302,
				headers: {
					'Location': ru,
					...CORS_HEADERS
				}
			});
			return response;

		}

		req.user = user;
	} catch (err) {
		console.error("Error decoding jwt:", err);
		const response = new Response(null, {
			status: 302,
			headers: {
				'Location': ru,
				...CORS_HEADERS
			}
		});
		return response;
	}
}

async function verifyGoogleAuthToken(token: string, env: Env): Promise<UserData | null> {
	let user = {} as UserData;
	try {
		const keysString = await env.KV.get('GOOGLE_AUTH_KEYS');

		if (!keysString) {
			console.error('Google OAuth keys not found in KV.');
			const rotated = await rotateAuthToken(env.KV)

			if (!rotated) return null;

			return verifyGoogleAuthToken(token, env);
		}

		const keys: GooglePublicKey[] = JSON.parse(keysString);
		const kid = decodeProtectedHeader(token).kid;
		const matchedKey = keys.find(key => key.kid === kid);

		if (!matchedKey) {
			console.warn(`No matching key found for kid: ${kid}`);
			return null;
		}

		const jwk = {
			kty: matchedKey.kty,
			n: matchedKey.n,
			e: matchedKey.e,
			kid: matchedKey.kid,
			alg: matchedKey.alg,
		};

		const key = await importJWK(jwk, 'RS256');

		const { payload, protectedHeader } = await jwtVerify(token, key, {
			issuer: 'https://accounts.google.com',
			audience: env.CLIENT_ID,
		});

		user = {
			id: payload.sub,
			name: payload.name,
			email: payload.email
		} as UserData;

		return user;
	} catch (error) {
		// if (error instanceof JWTExpired) {
		// 	console.error('jwt expired:', error);
		// 	const payload = error.payload;

		// 	user = {
		// 		id: payload.sub,
		// 		name: payload.name,
		// 		email: payload.email
		// 	} as UserData;

		// 	return user;
		// }
		console.error('Error verifying Google auth token:', error);
		return null;
	}
}

const preflight = async (req: Request) => {
	if (req.method === 'OPTIONS') {
		return new Response(null, {
			headers: CORS_HEADERS,
		});
	}
}

const router = Router();

router.options('*', preflight);

router.use(json());

router.post('/rules', withAuthenticatedUser, async (req: AuthRequest, env: Env, ctx: ExecutionContext) => {
	const body: HostData = await req.json();

	const vErr = validateHostData(body);

	if (vErr)
		return json({ success: false, error: vErr }, { status: 400 });

	try {
		let id = 0;
		let expressions;
		if (body.expressions) {
			expressions = [] as Rule[];

			for (const exp of body.expressions) {
				id++;
				const r = buildRule(id, exp.type, exp.operator, exp.value, exp.logic);
				expressions.push(r);
			}
		}

		const period = body.period;
		const duration = body.duration;

		if (period > TWENTY_FOUR_HOURS) {
			return json({ success: false, error: 'period should be less than that!' }, { status: 400 });
		}
		if (duration > TWENTY_FOUR_HOURS) {
			return json({ success: false, error: 'duration should be less than that!' }, { status: 400 });
		}

		const userPlan = await env.DB.prepare(`
			SELECT plan FROM users WHERE id = ?
		`).bind(req.user.id).first('plan') as Plan;

		if (userPlan === Plan.free) {
			const rulesCount = await env.DB.prepare(`
				SELECT COUNT(*) FROM rules WHERE user_id = ?
			`).bind(req.user.id).first('COUNT(*)') as number;
			if (rulesCount >= 2) {
				return json({ success: false, error: 'Free plan is limited to 2 rules' }, { status: 400 });
			}
		}

		const host_id = generateRandomId();

		await env.DB.prepare(
			`INSERT INTO rules (id, name, host, protocol, port, period, duration, frequency, filter, expressions, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
		)
			.bind(
				host_id,
				body.name,
				body.host,
				body.protocol,
				body.port || null,
				period,
				duration,
				body.frequency,
				body.filter,
				expressions ? JSON.stringify(expressions) : null,
				req.user.id
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

async function purgeHostDataCache(id: string, env: Env) {
	try {
		//TODO: ADD COMMUNICATOR AUTH. Also through cloudflare block the request that is does not authenticated 
		const r = await fetch(`${env.GATEWAY_COMMUNICATOR_HOST}/cache/hosts/${id}`, {
			method: "DELETE",
			headers: {
				"Authorization": env.GATEWAY_COMMUNICATOR_SECRET
			}
		});

		if (r.status !== 200) {
			const jr = await r.json();
			console.log('error purging host data cache', jr);
		}
	} catch (err) {
		console.error("Error purging host data cache", err);
	}
}

router.put('/rules/:id', withAuthenticatedUser, async (req: AuthRequest, env: Env, ctx: ExecutionContext) => {
	try {
		let id = req.params.id;

		if (id.length !== ID_LENGTH) {
			return json({ success: false, error: 'invalid id' }, { status: 400 });
		}

		const body: HostData = await req.json();

		const vErr = validateHostData(body);
		if (vErr)
			return json({ success: false, error: vErr }, { status: 400 });

		const { results } = await env.DB.prepare(`SELECT * FROM rules WHERE id = ? AND user_id = ?`).bind(id, req.user.id).all();

		const host = results[0] || null;

		if (!host) {
			return json({ success: false, error: 'resource not found!' }, { status: 404 });
		}

		let expressions;
		let rule_id = 0;

		if (body.expressions) {
			expressions = [];
			for (const exp of body.expressions) {
				rule_id++;
				const r = buildRule(rule_id, exp.type, exp.operator, exp.value, exp.logic);
				expressions.push(r);
			}
		}

		const period = body.period;
		const duration = body.duration;

		if (period > TWENTY_FOUR_HOURS) {
			return json({ success: false, error: 'period should be less than that!' }, { status: 400 });
		}
		if (duration > TWENTY_FOUR_HOURS) {
			return json({ success: false, error: 'duration should be less than that!' }, { status: 400 });
		}

		await env.DB.prepare(
			`UPDATE rules SET name = ?, host = ?, protocol = ?, port = ?, period = ?, duration = ?, frequency = ?, filter = ?, expressions = ? WHERE id = ? AND user_id = ?;`,
		)
			.bind(
				body.name,
				body.host,
				body.protocol,
				body.port || null,
				period,
				duration,
				body.frequency,
				body.filter,
				expressions ? JSON.stringify(expressions) : null,
				id,
				req.user.id,
			)
			.run();

		ctx.waitUntil(purgeHostDataCache(id, env))

		return json({ success: true, id: id }, { status: 200 });
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

router.get('/rules/:id', withAuthenticatedUser, async (req: AuthRequest, env: Env, ctx: ExecutionContext) => {
	try {
		let id = req.params.id;

		if (id.length !== ID_LENGTH) {
			return json({ success: false, error: 'invalid id' }, { status: 400 });
		}

		const { results } = await env.DB.prepare(`SELECT * FROM rules WHERE id = ? AND user_id = ?`).bind(id, req.user.id).all();

		const rule = results[0] || null;

		if (!rule) {
			return json({ success: false, error: 'resource not found!' }, { status: 404 });
		}

		return json({ success: true, result: rule }, { status: 200 });
	} catch (err) {
		if (err instanceof Error) {
			console.error('internal error:', err);
			return json({ success: false, error: 'internal error' }, { status: 500 });
		}
	}
});

router.get('/gateway/rules/:id', async (req: IRequest, env: Env, ctx: ExecutionContext) => {
	try {
		let id = req.params.id;

		if (id.length !== ID_LENGTH) {
			return json({ success: false, error: 'invalid id' }, { status: 400 });
		}

		const { results } = await env.DB.prepare(`SELECT * FROM rules WHERE id = ?`).bind(id).all();

		const rule = results[0] || null;

		if (!rule) {
			return json({ success: false, error: 'resource not found!' }, { status: 404 });
		}

		return json({ success: true, result: rule }, { status: 200 });
	} catch (err) {
		if (err instanceof Error) {
			console.error('internal error:', err);
			return json({ success: false, error: 'internal error' }, { status: 500 });
		}
	}
});

router.get('/rules', withAuthenticatedUser, async (req: AuthRequest, env: Env, ctx: ExecutionContext) => {
	try {
		const { results } = await env.DB.prepare(`SELECT id, name FROM rules WHERE user_id = ?`).bind(req.user.id).all();

		return json({ success: true, result: results }, { status: 200 });
	} catch (err) {
		if (err instanceof Error) {
			console.error('internal error:', err);
			return json({ success: false, error: 'internal error' }, { status: 500 });
		}
	}
});

router.delete('/rules/:id', withAuthenticatedUser, async (req: AuthRequest, env: Env, ctx: ExecutionContext) => {
	try {
		let id = req.params.id;

		if (id.length !== ID_LENGTH) {
			return json({ success: false, error: 'invalid id' }, { status: 400 });
		}

		const { success } = await env.DB.prepare(`DELETE FROM rules WHERE id = ?`).bind(id).run();

		if (success) {
			return json({ success: true }, { status: 200 });
		} else {
			return json({ success: false, error: 'cannot delete host!' }, { status: 400 });
		}
	} catch (err) {
		if (err instanceof Error) {
			console.error('internal error:', err);
			return json({ success: false, error: 'internal error' }, { status: 500 });
		}
	}
});

router.get('/constraints', async (req: IRequest, env: Env, ctx: ExecutionContext) => {
	try {
		return json({ success: true, constraints: ruleConstraints }, { status: 200 });
	} catch (err) {
		if (err instanceof Error) {
			console.error('internal error:', err);
			return json({ success: false, error: 'internal error' }, { status: 500 });
		}
	}
});

router.post("/auth/google/callback", async (req: IRequest, env: Env, ctx: ExecutionContext) => {
	const body = await req.json();

	if (!isAuthRequestData(body)) {
		return json({ success: false, error: 'invalid auth request' }, { status: 400 });
	}

	const token = body.token;

	try {

		if (!token) {
			throw new Error('No access token received from Google');
		}

		const user = await verifyGoogleAuthToken(token, env)

		if (!user) {
			throw new Error('Authentication failed!!!');
		}

		let exUser = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(user.id).first();

		if (!exUser) {
			const insertResult = await env.DB.prepare("INSERT INTO users (id, name, email) VALUES (?, ?, ?)")
				.bind(user.id, user.name, user.email)
				.run();

			if (insertResult.success) {
			} else {
				console.error("Failed to create new user:", insertResult.error);
				return json({ success: false, error: "Failed to create new user" }, { status: 500 });
			}
		}

		user.plan = Plan.free;

		return json({ success: true, user, token }, { status: 200 });
	} catch (error) {
		console.error("Error during token exchange:", error);
		return json({ success: false, error: "Failed to authenticate" }, { status: 400 });
	}
});

router.get("/plans", withAuthenticatedUser, async (req: AuthRequest, env: Env, ctx: ExecutionContext) => {
	try {
		const result = await env.DB.prepare("SELECT plan FROM users WHERE id = ?")
			.bind(req.user.id)
			.first<{ plan: number }>();

		if (result) {
			return json({ success: true, plan: result.plan }, { status: 200 });
		} else {
			return json({ success: false, error: "User not found" }, { status: 404 });
		}
	} catch (error) {
		console.error("Error during plan retrieval:", error);
		return json({ success: false, error: "Failed to retrieve plan" }, { status: 500 });
	}
});

router.post("/plans/upgrade", withAuthenticatedUser, async (req: AuthRequest, env: Env, ctx: ExecutionContext) => {
	const { plan } = await req.json<{ plan: string }>();

	if (!Plan[plan as keyof typeof Plan]) {
		return json({ success: false, error: 'invalid plan' }, { status: 400 });
	}

	try {
		const updateResult = await env.DB.prepare("UPDATE users SET plan = ? WHERE id = ?")
			.bind(plan, req.user.id)
			.run();

		if (updateResult.success) {
			return json({ success: true }, { status: 200 });
		} else {
			console.error("Failed to update user plan:", updateResult.error);
			return json({ success: false, error: "Failed to update user plan" }, { status: 400 });
		}
	} catch (error) {
		console.error("Error during plan upgrade:", error);
		return json({ success: false, error: "Failed to upgrade plan" }, { status: 500 });
	}
});

router.all('*', async (req, env, ctx) => {
	return new Response('resource not found', { status: 404 });
});

async function rotateAuthToken(KV: KVNamespace) {
	try {
		const response = await fetch('https://www.googleapis.com/oauth2/v3/certs');
		const data = (await response.json()) as GooglePublicKeysReponse;

		if (!data.keys || !Array.isArray(data.keys)) {
			console.error('Invalid certificate data received from Google.');
			return;
		}

		const keys = JSON.stringify(data.keys);
		await KV.put('GOOGLE_AUTH_KEYS', keys);
		return true;
	} catch (error) {
		console.error('Error rotating Google OAuth public keys:', error);
		return null;
	}
}

async function runScheduledTasks(event: ScheduledController, env: Env, ctx: ExecutionContext) {
	await rotateAuthToken(env.KV);
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return router
			.fetch(request, env, ctx)
			.then(json)
			.catch((error: Error) => {
				console.error('Error during fetch', error);
				return new Response('Internal Server Error', { status: 500 });
			})
			.then((response: Response) => {
				if (response.status < 300 || response.status >= 400) {
					for (const key in CORS_HEADERS) {
						response.headers.set(key, CORS_HEADERS[key as keyof typeof CORS_HEADERS]);
					}
				}
				return response;
			})
	},
	scheduled: runScheduledTasks,
} satisfies ExportedHandler<Env>;

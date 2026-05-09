
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// THETA関連APIのまとめ
// https://qiita.com/mktshhr/items/d9667a5456beffdf51b9

import Koa from "koa";
import Router from "koa-router";
import fetch, { Response, } from "node-fetch";

const router: Router = new Router();

router.post("/osc/commands/execute", async (context: Koa.Context): Promise<void> => {
	return oscCommandsExecute(context, JSON.stringify(context.request.body));
});

router.get("/live_preview/:sessionId", async (context: Koa.Context): Promise<void> => {
	return oscCommandsExecute(context, JSON.stringify({
		name: "camera._getLivePreview",
		parameters: {
			sessionId: context.params.sessionId,
		},
	}));
});

export default router;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

async function oscCommandsExecute (context: Koa.Context, body: string): Promise<void> {
	try {
		const protocol: string = "http:";
		const port: string = "80";
		const hostname: string = "192.168.1.1";
		const pathname: string = "/osc/commands/execute";
		const responseRow: Response = await fetch(`${protocol}//${hostname}:${port}${pathname}`, {
			method: "POST",
			headers: { "Content-Type": "application/json", },
			body,
		});

		context.status = responseRow.status;
		responseRow.headers.forEach((value: string, name: string): void => context.set(name, value));
		context.body = responseRow.body;
	} catch (error) {
		console.log(error);
		context.throw(400, "unknown");
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


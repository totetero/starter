
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import { listenAndServe, ServerRequest, Response } from "https://deno.land/std@0.50.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.50.0/http/file_server.ts";

const handlerTestGet = async (req: ServerRequest, res: Response): Promise<void> => {
	res.body = "test";
	return req.respond(res);
};

const handlerError404 = async (req: ServerRequest, res: Response): Promise<void> => {
	res.status = 404;
	res.body = "not found";
	return req.respond(res);
};

console.log("http://localhost:8080/");

listenAndServe({
	port: 8080,
}, async (req: ServerRequest): Promise<void> => {
	const res: Response = {};
	if (req.url === "/test" && req.method === "GET") { return handlerTestGet(req, res); }
	if (req.url === "/") { return req.respond(await serveFile(req, "public/index.html")); }
	return handlerError404(req, res);
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


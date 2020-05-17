
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import { listenAndServe, ServerRequest, Response, } from "https://deno.land/std@0.50.0/http/server.ts";
import { serveFile, } from "https://deno.land/std@0.50.0/http/file_server.ts";

const handlerTestGet = async (req: ServerRequest, res: Response): Promise<void> => {
	res.body = "test";
	return req.respond(res);
};

const handlerFileGet = async (req: ServerRequest, res: Response, path: string): Promise<void> => {
	const data: Response = await serveFile(req, path)
	return req.respond(data);
};

const handlerError404 = async (req: ServerRequest, res: Response): Promise<void> => {
	res.status = 404;
	res.body = "not found";
	return req.respond(res);
};

const handlerError500 = async (req: ServerRequest, res: Response, error: Error): Promise<void> => {
	console.error(error);
	res.status = 500;
	res.body = "internal server error";
	return req.respond(res);
};

const port: number = 8080;
console.log(`http://localhost:${port}`);

listenAndServe({ port, }, async (req: ServerRequest): Promise<void> => {
	const res: Response = {};
	try {
		const isGet: boolean = req.method === "GET";
		if (req.url === "/test" && isGet) { return await handlerTestGet(req, res); }
		if (req.url === "/" && isGet) { return await handlerFileGet(req, res, "public/index.html"); }
		return await handlerError404(req, res);
	} catch(error) {
		return await handlerError500(req, res, error);
	}
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


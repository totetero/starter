
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const https = require("https");
const fs = require("fs");

const pfxPath = "./mysslserver.pfx";
const htmlPath = "./index.html";
const mp4Path = "./test.mp4";

const port = 8080;
Promise.resolve().then(() => {
	return new Promise((resolve, reject) => fs.readFile(pfxPath, (pfxError, pfxFile) => pfxError ? reject(pfxError) : resolve(pfxFile)));
}).then(pfxFile => {
	https.createServer({
		pfx: pfxFile,
		passphrase: "test",
	}).on("request", (req, res) => {
		const isGet = (req.method === "GET");
		if (isGet && req.url === "/") {
			Promise.resolve().then(() => {
				return new Promise((resolve, reject) => fs.readFile(htmlPath, "utf-8", (htmlError, htmlFile) => htmlError ? reject(htmlError) : resolve(htmlFile)));
			}).then(htmlFile => {
				res.writeHead(200, { "Content-Type": "text/html" });
				res.write(htmlFile);
				res.end();
			}).catch(htmlError => {
				res.writeHead(404, { "Content-Type": "text/plain" });
				res.write("404 Not Found\n");
				res.end();
			});
		} else if(isGet && req.url === "/test.mp4") {
			Promise.resolve().then(() => {
				return new Promise((resolve, reject) => fs.stat(mp4Path, (mp4Error, mp4Stat) => mp4Error ? reject(mp4Error) : resolve(mp4Stat)));
			}).then(mp4Stat => {
				if (req.headers.range) {
					const parts = req.headers.range.replace(/bytes=/, "").split("-");
					const start = parseInt(parts[0], 10);
					const end = Math.min(start + 0x0000ffff, parts[1] ? parseInt(parts[1], 10) : mp4Stat.size - 1);
					const chunksize = (end - start) + 1;
					const range = `bytes ${start}-${end}/${mp4Stat.size}`;
					res.writeHead(206, { "Accept-Ranges": "bytes", "Content-Range": range, "Content-Length": chunksize, "Content-Type": "video/mp4", });
					fs.createReadStream(mp4Path, { start, end, }).pipe(res).on("error", streamError => res.end(streamError));
				} else {
					res.writeHead(200, { "Content-Length": mp4Stat.size, "Content-Type": "video/mp4", });
					fs.createReadStream(mp4Path).pipe(res).on("error", streamError => res.end(streamError));
				}
			}).catch(mp4Error => {
				res.writeHead(404, { "Content-Type": "text/plain" });
				res.write("404 Not Found\n");
				res.end();
			});
		} else {
			res.writeHead(404, { "Content-Type": "text/plain" });
			res.write("404 Not Found\n");
			res.end();
		}
	}).listen(port, () => console.log(`Server https://localhost:${port}`));
}).catch(pfxError => {});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

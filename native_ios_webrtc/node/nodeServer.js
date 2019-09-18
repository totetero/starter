
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const https = require("https");
const fs = require("fs");

const port = 8080;
fs.readFile("./mysslserver.pfx", (err, filePfx) => {
	https.createServer({
		pfx: filePfx,
		passphrase: "test",
	}).on("request", (req, res) => {
		if(req.method === "GET" && req.url === "/"){
			fs.readFile("./index.html", "utf-8", (err, fileHtml) => {
				res.writeHead(200, {"Content-Type": "text/html"});
				res.write(fileHtml);
				res.end();
			});
		}else{
			res.writeHead(404, {"Content-Type": "text/plain"});
			res.write("404 Not Found\n");
			res.end();
		}
	}).listen(port, () => console.log(`Server https://localhost:${port}`));
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as express from "express";
import { apolloServer, } from "./apolloServer";

const port: number = 8080;

const app: express.Express = express();
app.use(express.static("public"));
app.use(apolloServer);
app.listen(port, (): void => console.log(`http://localhost:${port}`));

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


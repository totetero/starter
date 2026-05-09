
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { apolloServer, } from "@server/apollo/server";
import apiTest from "@server/api/apiTest";
import apiError from "@server/api/apiError";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const app: express.Express = express();
app.use(bodyParser.json());
app.use(cors());
app.use(apolloServer);
app.post("/test", apiTest);
app.use(apiError);

export default app;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


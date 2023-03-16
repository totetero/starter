
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa-cors";
import serve from "koa-static";
import routerTheta from "./theta"

const app: Koa = new Koa();
app.use(bodyParser());
app.use(cors());
app.use(routerTheta.routes());
app.use(serve("./public"));
app.listen(8080);

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


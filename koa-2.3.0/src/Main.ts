import * as Koa from "koa";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

class Main{
	// コンストラクタ
	constructor(){}

	// サーバ起動
	public start(): void{
		const app: Koa = new Koa();

		// アクセスログ
		app.use(async (context: Koa.Context, next: ()=>Promise<any>): Promise<any> => {
			const timeStart: number = Date.now();
			await next();
			const timeDiff: number = Date.now() - timeStart;
			console.log(`${context.method} ${context.url} - ${timeDiff}ms`);
		});

		// エラーハンドリング
		app.use(async (context: Koa.Context, next: ()=>Promise<any>): Promise<any> => {
			try{
				await next();
			}catch(error){
				context.body = {message: error.message,};
				context.status = error.status || 500;
				console.log(error);
			}
		});

		// レスポンス
		app.use(async (context: Koa.Context, next: ()=>Promise<any>): Promise<any> => {
			context.body = "Hello, Koa!";
		});

		const port: number = 8080;
		app.listen(port, (): void => {
			console.log("Server running on https://localhost:" + port);
		});
	}
}

const main: Main = new Main();
main.start();

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


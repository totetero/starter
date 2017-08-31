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
			//const dateStart: Date = new Date();
			await next();
			//const time = new Date() - dateStart;
			console.log(`${context.method} ${context.url} - ${0}ms`);
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


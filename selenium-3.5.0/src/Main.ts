import * as webdriver from "selenium-webdriver";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

class Main{
	private _driver: webdriver.ThenableWebDriver;
	private _isStart: boolean = false;

	// コンストラクタ
	constructor(){
		// ドライバ作成
		const builder: webdriver.Builder = new webdriver.Builder().forBrowser("chrome");
		this._driver = builder.build();

		// ブラウザを開く
		this._driver.get("https://google.com").then((): void => {
			this._isStart = true;
		});
	}

	// 起動
	public start(): void{
		const waitConditionMessageOpen: string = "start up browser";

		Promise.resolve().then((): webdriver.promise.Promise<any> => {
			// ブラウザが起動するのを待ってから処理を開始する
			return this._driver.wait(new webdriver.Condition(waitConditionMessageOpen, (): boolean => this._isStart), 10000);
		}).then((): Promise<void> => new Promise<void>((resolve: ()=>void, reject: (err: any)=>void): void => {
			// とりあえず少し待つ
			setTimeout((): void => resolve(), 1000);
		})).then((): void => {
			// 完了したので終了する
			this._driver.quit();
		}).catch((err: any): void => {
			// エラーハンドリング
			if(err instanceof webdriver.error.TimeoutError && err.message.indexOf(waitConditionMessageOpen) >= 0){
				// ブラウザを開くエラー
				console.error("timeout error open", err);
			}else{
				// その他のエラー
				console.error("unknown error", err);
			}
			// エラーなので終了する
			this._driver.quit();
		});
	}
}

const main: Main = new Main();
main.start();

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


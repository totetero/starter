import * as webdriver from "selenium-webdriver";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

class Main{
	// コンストラクタ
	constructor(){}

	// サーバ起動
	public start(): void{
		const driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
		driver.get('https://www.google.co.jp/').then(function(){
			driver.quit();
		});
	}
}

const main: Main = new Main();
main.start();

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


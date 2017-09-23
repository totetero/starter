import * as webdriver from "selenium-webdriver";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

class Main{
	// コンストラクタ
	constructor(){}

	// サーバ起動
	public start(): void{
		const builder: webdriver.Builder = new webdriver.Builder().forBrowser("chrome");
		const driver: webdriver.ThenableWebDriver = builder.build();
		driver.get("http://totetero.com").then((): void => {
			driver.quit();
		});
	}
}

const main: Main = new Main();
main.start();

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


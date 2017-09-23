"use strict";

const webdriver = require("selenium-webdriver");

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// 定数
const consts = {
	CONDITION_MESSAGE_OPEN: "start up browser",
};

// 大域変数オブジェクト作成
const global = {
	driver: new webdriver.Builder().forBrowser("chrome").build(),
	isStart: false,
};

// ブラウザを開く
global.driver.get("https://google.com").then(() => {
	global.isStart = true;
});

Promise.resolve().then(() => {
	// ブラウザが起動するのを待ってから処理を開始する
	return global.driver.wait(new webdriver.Condition(consts.CONDITION_MESSAGE_OPEN, () => global.isStart), 10000);
}).then(() => new Promise((resolve, reject) => {
	// とりあえず少し待つ
	setTimeout(() => resolve(), 1000);
})).then(() => {
	// 完了したので終了する
	global.driver.quit();
}).catch((err) => {
	// エラーハンドリング
	if(err instanceof webdriver.error.TimeoutError && err.message.indexOf(consts.CONDITION_MESSAGE_OPEN) >= 0){
		// ブラウザを開くエラー
		console.error("timeout error open", err);
	}else{
		// その他のエラー
		console.error("unknown error", err);
	}
	// エラーなので終了する
	global.driver.quit();
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


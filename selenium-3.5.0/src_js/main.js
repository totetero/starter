"use strict";

const webdriver = require("selenium-webdriver");

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// メモ

// http://qiita.com/nazomikan/items/40b86dc5619bb1795aaa

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// 設定
const config = {
	url1: `file:///${__dirname}/../html/test.html`,
	url2: `file:///${__dirname}/../html/draw.html`,
	baseW: 640,
	baseH: 1136,
	touchX: 320,
	touchY: 568,
};

// 大域変数オブジェクト作成
const global = {
	driver: null,
	isTouch: false,
	touchDnFn: null,
	touchMvFn: null,
	touchUpFn: null,
};

const mainAction = () => Promise.resolve().then(() => {
	// ブラウザを開く
	global.driver = new webdriver.Builder().forBrowser("chrome").build();
	return global.driver.get(config.url1);
}).then(() => {
	// とりあえず少し待つ
	return new Promise((resolve, reject) => {setTimeout(() => resolve(), 200)});
}).then(() => {
	// jsを実行 セッションストレージの設定
	return global.driver.executeScript("sessionStorage.setItem('hoge', 'fuga');");
}).then(() => {
	// とりあえず少し待つ
	return new Promise((resolve, reject) => {setTimeout(() => resolve(), 200)});
}).then(() => {
	// ページ移動
	return global.driver.navigate().to(config.url2);
}).then(() => {
	// とりあえず少し待つ
	return new Promise((resolve, reject) => {setTimeout(() => resolve(), 200)});
}).then(() => {
	// jsを実行 タッチ対応の調査
	return global.driver.executeScript("return ('ontouchstart' in window);").then((value) => {global.isTouch = value;});
}).then(() => {
	// タッチターゲットを取得してタッチ関数作成
	let target = null;
	let targetSize = null;
	let targetLocation = null;
	return Promise.resolve().then(() => {
		return global.driver.findElement(webdriver.By.tagName("canvas")).then((value) => {target = value;});
	}).then(() => {
		return target.getSize().then((value) => {targetSize = value;});
	}).then(() => {
		return target.getLocation().then((value) => {targetLocation = value;});
	}).then(() => {
		// 座標系を変換してからイベントを発火する関数の作成
		if(global.isTouch){
			// タッチ関数作成
			const x0 = targetLocation.x;
			const y0 = targetLocation.y;
			const rx = targetSize.width / config.baseW;
			const ry = targetSize.height / config.baseH;
			const calc = (x, y) => ({x: Math.round(x0 + x * rx), y: Math.round(y0 + y * ry),});
			global.touchDnFn = (x, y) => global.driver.touchActions().tapAndHold(calc(x, y)).perform();
			global.touchMvFn = (x, y) => global.driver.touchActions().move(calc(x, y)).perform();
			global.touchUpFn = (x, y) => global.driver.touchActions().release(calc(x, y)).perform();
		}else{
			// マウス関数作成
			const rx = targetSize.width / config.baseW;
			const ry = targetSize.height / config.baseH;
			const calc = (x, y) => ({x: Math.round(x * rx), y: Math.round(y * ry),});
			global.touchDnFn = (x, y) => global.driver.actions().mouseDown(target, calc(x, y)).perform();
			global.touchMvFn = (x, y) => global.driver.actions().mouseMove(target, calc(x, y)).perform();
			global.touchUpFn = (x, y) => global.driver.actions().mouseUp(target, calc(x, y)).perform();
		}
	});
}).then(() => {
	// 連続タッチ処理
	return new Promise((resolve, reject) => {
		let count = 0;
		const touchAction = () => Promise.resolve().then(() => {
			// タッチ開始
			return global.touchDnFn(config.touchX, config.touchY).then(() => new Promise((resolve, reject) => {setTimeout(() => resolve(), 10)}));
		}).then(() => {
			// タッチ途中 ぐるぐる
			const tasks = [];
			const radius = 100;
			const quality = 32;
			for(let i = 0; i < quality; i++){
				const t = 2 * Math.PI * i / (quality - 1);
				const x = config.touchX + radius * Math.cos(t);
				const y = config.touchY + radius * Math.sin(t);
				tasks.push(() => global.touchMvFn(x, y));
				tasks.push(() => new Promise((resolve, reject) => {setTimeout(() => resolve(), 10)}));
			}
			return tasks.reduce((prev, curr) => prev.then(curr), Promise.resolve());
		}).then(() => {
			// タッチ途中
			return global.touchMvFn(config.touchX, config.touchY).then(() => new Promise((resolve, reject) => {setTimeout(() => resolve(), 10)}));
		}).then(() => {
			// タッチ完了
			return global.touchUpFn(config.touchX, config.touchY).then(() => new Promise((resolve, reject) => {setTimeout(() => resolve(), 10)}));
		}).then(() => {
			// ループ判定
			if(++count < 3){
				// ループする
				touchAction();
			}else{
				// 終了する
				resolve();
			}
		}).catch((err) => {
			// エラーをそのまま渡す
			reject(err);
		});
		touchAction();
	});
}).then(() => {
	// スクリーンショットを撮る
	//const htmlBefore = "<html><head></head><body style='margin: 0;'><img style='max-width: 100%; max-height: 100%;' src='data:image/png;base64,";
	//const htmlAfter = "'></body></html>";
	//return global.driver.takeScreenshot().then((screenshot) => console.log(`${htmlBefore}${screenshot}${htmlAfter}`));
}).then(() => {
	// ログ取得と表示
	//return global.driver.manage().logs().get(webdriver.logging.Type.BROWSER).then((logList) => console.log(logList));
}).then(() => {
	// 完了したので終了する
	global.driver.quit();
}).catch((err) => {
	// エラーハンドリング
	if(true){
		// その他のエラー
		console.error("unknown error", err);
	}
	// エラーなので終了する
	global.driver.quit();
	// 再び起動する
	mainAction();
});

mainAction();

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


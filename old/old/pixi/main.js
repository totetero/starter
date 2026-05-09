
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// 読み込みが終わったら処理開始
document.addEventListener("DOMContentLoaded", (e) => {
	PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? "WebGL" : "canvas");
	PIXI.loader.add("img/test.png")
	PIXI.loader.load(() => {
		const main = new Main();
		main.setup();
	});
});

// メインクラス 処理はこのクラスから始まる
class Main{
	constructor(){
		this.renderer = null;
		this.root = null;
		this.sprite = null;
	}

	setup(){
		const width = 256;
		const height = 256;

		this.renderer = PIXI.autoDetectRenderer(width, height);
		this.renderer.backgroundColor = 0xff0000;
		document.getElementById("screen").appendChild(this.renderer.view);

		this.root = new PIXI.Container();

		const texture = PIXI.loader.resources["img/test.png"].texture;
		this.sprite = new PIXI.Sprite(texture);
		this.root.addChild(this.sprite);

		this.mainloop();
	}

	mainloop(){
		this.sprite.x = (this.sprite.x + 1) % 100;
		this.renderer.render(this.root);
		window.requestAnimationFrame(this.mainloop.bind(this));
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

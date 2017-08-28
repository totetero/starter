
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

phina.globalize();

phina.define('MainScene', {
	superClass: 'DisplayScene',

	init: function() {
		this.superInit();

		// 円を表示
		var circle = CircleShape().addChildTo(this);
		circle.x = 200; // x 座標を指定
		circle.y = 480; // y 座標を指定

		// 四角形を表示
		var rect = RectangleShape().addChildTo(this);
		rect.x = 320;
		rect.y = 480;
		rect.fill = 'cyan'; // 塗りつぶし色を変更
		rect.strokeWidth = 8; // ストローク幅を変更

		// スターを表示
		var star = StarShape().addChildTo(this);
		star.x = 440;
		star.y = 480;
		star.radius = 64; // 半径を変更
	},
});

phina.main(function() {
	var app = GameApp({
		startLabel: 'main',
	});

	app.run();
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

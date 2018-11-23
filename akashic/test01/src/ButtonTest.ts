
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// テストボタンクラス
export class ButtonTest extends g.E{
	private area: g.E = null;
	private isDown: boolean = false;
	private isMove: boolean = false;

	constructor(param: g.EParameterObject){
		super(param);

		this.update.add((): void => this.calc());

		// ボタン範囲作成
		const width: number = 96;
		const height: number = 96;
		this.area = new g.E({
			scene: param.scene,
			x: -width / 2,
			y: -height / 2,
			width: width,
			height: height,
			touchable: true,
		});
		this.area.pointDown.add((e: g.PointDownEvent): void => this.mdn(e));
		this.area.pointMove.add((e: g.PointMoveEvent): void => this.mmv(e));
		this.area.pointUp.add((e: g.PointUpEvent): void => this.mup(e));
		this.append(this.area);

		// ボタン背景作成
		this.area.append(new g.FilledRect({
			scene: this.area.scene,
			width: this.area.width,
			height: this.area.height,
			cssColor: "red",
		}));

		// ラベル作成
		const label: g.Label = new g.Label({
			scene: this.area.scene,
			font: new g.DynamicFont({
				game: this.area.scene.game,
				fontFamily: g.FontFamily.Serif,
				size: 15
			}),
			text: "test",
			fontSize: 15,
			textColor: "black",
		});
		label.x = (this.area.width - label.width) / 2;
		label.y = (this.area.height - label.height) / 2;
		this.area.append(label);
	}

	// 計算
	calc(): void{
		const scale: number = (this.isDown && !this.isMove) ? 0.8 : 1.0;
		this.area.scaleX += (scale - this.area.scaleX) * 0.5;
		this.area.scaleY += (scale - this.area.scaleY) * 0.5;
		this.area.modified();
	}

	// タッチ開始
	mdn(e: g.PointDownEvent): void{
		this.isDown = true;
		this.isMove = false;
	}

	// タッチ移動
	mmv(e: g.PointMoveEvent): void{
		if(!this.isMove){
			const x: number = e.startDelta.x;
			const y: number = e.startDelta.y;
			const r: number = 5;
			this.isMove = (x * x + y * y > r * r);
		}
	}

	// タッチ完了
	mup(e: g.PointUpEvent): void{
		this.isDown = false;
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

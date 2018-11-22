
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

export class MainScene extends g.Scene{
	private rect: g.FilledRect = null;

	constructor(param: g.SceneParameterObject){
		super(param);
		this.loaded.add((): void => this.init());
	}

	init(): void{
		this.rect = new g.FilledRect({
			scene: this,
			cssColor: "green",
			width: 32,
			height: 32,
		});
		this.append(this.rect);
		this.update.add((): void => this.calc());
	}

	calc(): void{
		this.rect.x++;
		if(this.rect.x > this.game.width){this.rect.x = 0;}
		this.rect.modified();
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

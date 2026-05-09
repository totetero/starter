
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import { Component, OnInit, } from "@angular/core";

@Component({
	selector: "app-page-test",
	templateUrl: "./app/page-test/page-test.component.html",
	styleUrls: ["./app/page-test/page-test.component.css",],
})
export class PageTestComponent implements OnInit {
	public valueInput: string = "test";
	public valueOutput: string = "";

	constructor() {}
	ngOnInit(): void {}

	public handleClickTest(): void {
		this.valueOutput = this.valueInput;
	}
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


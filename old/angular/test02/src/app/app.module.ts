
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import { BrowserModule, } from "@angular/platform-browser";
import { NgModule, } from "@angular/core";
import { FormsModule, } from '@angular/forms';
import { AppComponent, } from "./app.component";
import { HeaderComponent, } from "./header/header.component";
import { FooterComponent, } from "./footer/footer.component";
import { PageTestComponent, } from "./page-test/page-test.component";

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		PageTestComponent,
	],
	imports: [BrowserModule, FormsModule,],
	providers: [],
	bootstrap: [AppComponent,]
})
export class AppModule {}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


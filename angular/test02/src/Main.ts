
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import "zone.js";
import { platformBrowserDynamic, } from "@angular/platform-browser-dynamic";
import { AppModule, } from "./app/app.module";

// 処理はここから始まる
document.addEventListener("DOMContentLoaded", (event: Event): void => {
	platformBrowserDynamic().bootstrapModule(AppModule).catch((error: Error): void => console.error(error));
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


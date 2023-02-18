
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";
import * as ReactDomClient from "react-dom/client";
import ComponentsRoot from "./components";

// 処理はここから始まる
document.addEventListener("DOMContentLoaded", (event: Event): void => {
	const container: HTMLElement | null = document.getElementById("app");
	if (container === null) { return; }
	const root: ReactDomClient.Root = ReactDomClient.createRoot(container);
	root.render(React.createElement(ComponentsRoot));
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

